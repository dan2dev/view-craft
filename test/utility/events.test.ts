import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { dispatchGlobalUpdateEvent } from '../../src/utility/events';

describe('utility/events.dispatchGlobalUpdateEvent', () => {
  let origConsoleError: any;
  let consoleErrorSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    // Clean document listeners between tests
    document.body.innerHTML = '';
    // Spy on console.error for error branch test
    origConsoleError = console.error;
    consoleErrorSpy = vi.fn();
    console.error = consoleErrorSpy as any;
  });

  afterEach(() => {
    console.error = origConsoleError;
  });

  it('dispatches one update event on body and two observable events on document (bubble + direct)', () => {
    const order: string[] = [];
    const bodyHandler = vi.fn((e: Event) => {
      order.push('body');
      expect(e.type).toBe('update');
    });
    const docHandler = vi.fn((e: Event) => {
      order.push('document');
      expect(e.type).toBe('update');
    });

    document.body.addEventListener('update', bodyHandler);
    document.addEventListener('update', docHandler);

    dispatchGlobalUpdateEvent();

    // Body should receive exactly one event
    expect(bodyHandler).toHaveBeenCalledTimes(1);
    // Document should receive one from bubbling + one from direct dispatch
    expect(docHandler).toHaveBeenCalledTimes(2);

    // Expected order: body listener first, then document via bubble, then document direct
    expect(order).toEqual(['body', 'document', 'document']);
  });

  it('still dispatches on document if body dispatch throws (error path)', () => {
    const docHandler = vi.fn();
    document.addEventListener('update', docHandler);

    // Replace body.dispatchEvent to throw
    const originalBodyDispatch = document.body.dispatchEvent.bind(document.body);
    (document.body as any).dispatchEvent = vi.fn(() => {
      throw new Error('boom-body-dispatch');
    });

    dispatchGlobalUpdateEvent();

    // Body dispatch threw -> body listeners never ran, but error was logged
    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    const firstErrorMsg = consoleErrorSpy.mock.calls[0][0];
    expect(String(firstErrorMsg)).toContain('Error dispatching global update event');

    // Document should still receive exactly one event (direct dispatch, no bubble from body)
    expect(docHandler).toHaveBeenCalledTimes(1);

    // Restore original
    (document.body as any).dispatchEvent = originalBodyDispatch;
  });

  it('multiple listeners accumulate expected counts (body 1, document 2 each)', () => {
    const bodyA = vi.fn();
    const bodyB = vi.fn();
    const docA = vi.fn();
    const docB = vi.fn();

    document.body.addEventListener('update', bodyA);
    document.body.addEventListener('update', bodyB);
    document.addEventListener('update', docA);
    document.addEventListener('update', docB);

    dispatchGlobalUpdateEvent();

    // Body listeners each called once
    expect(bodyA).toHaveBeenCalledTimes(1);
    expect(bodyB).toHaveBeenCalledTimes(1);

    // Document listeners each called twice (bubble + direct)
    expect(docA).toHaveBeenCalledTimes(2);
    expect(docB).toHaveBeenCalledTimes(2);

    // Ensure event objects provided are 'update'
    expect((docA.mock.calls[0][0] as Event).type).toBe('update');
    expect((docA.mock.calls[1][0] as Event).type).toBe('update');
  });
});
