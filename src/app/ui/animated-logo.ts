export function animatedLogo() {
  // Wave configuration - Sage green theme
  const waves = [
    { amplitude: 40, frequency: 0.015, speed: 0.02, offset: 0, color: 'rgba(156, 189, 175, 0.3)', id: 'wave-0' },
    { amplitude: 30, frequency: 0.02, speed: 0.025, offset: 50, color: 'rgba(168, 197, 184, 0.25)', id: 'wave-1' },
    { amplitude: 35, frequency: 0.018, speed: 0.015, offset: 100, color: 'rgba(127, 168, 154, 0.2)', id: 'wave-2' },
    { amplitude: 25, frequency: 0.022, speed: 0.03, offset: 150, color: 'rgba(86, 122, 107, 0.15)', id: 'wave-3' }
  ];

  const points = 200;
  const viewBoxWidth = 1000;
  const viewBoxHeight = 400;

  function generateWavePath(
    wave: typeof waves[0],
    mouseInfluence: number,
    mouseX: number,
    mouseY: number,
    time: number
  ): string {
    let pathData = '';

    for (let i = 0; i <= points; i++) {
      const x = (i / points) * viewBoxWidth;
      const normalizedX = i / points;

      // Distance from mouse
      const distanceFromMouse = Math.sqrt(
        Math.pow(normalizedX - mouseX, 2) +
        Math.pow(0.5 - mouseY, 2)
      );

      // Mouse effect
      const mouseEffect = Math.exp(-distanceFromMouse * 3) * mouseInfluence * 80;

      // Wave calculation
      const baseY = viewBoxHeight / 2 + wave.offset;
      const waveY = Math.sin(x * wave.frequency + time * wave.speed) * wave.amplitude;
      const y = baseY + waveY + mouseEffect;

      if (i === 0) {
        pathData += `M ${x} ${y}`;
      } else {
        pathData += ` L ${x} ${y}`;
      }
    }

    return pathData;
  }

  return div(
    {
      className: "w-full h-full overflow-hidden",
      innerHTML: `
        <svg viewBox="0 0 ${viewBoxWidth} ${viewBoxHeight}" preserveAspectRatio="xMidYMid slice" style="width: 100%; height: 100%;">
          ${waves.map(wave => `
            <path
              id="${wave.id}"
              stroke="${wave.color}"
              stroke-width="2"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
              d=""
            />
          `).join('')}
        </svg>
      `
    },
    (parent) => {
      const container = parent as unknown as HTMLElement;

      // Use setTimeout to ensure DOM is fully parsed
      setTimeout(() => {
        const svgElement = container.querySelector('svg') as SVGSVGElement;
        if (!svgElement) return;

        // Local state for this instance
        let mouseX = 0.5;
        let mouseY = 0.5;
        let targetMouseX = 0.5;
        let targetMouseY = 0.5;
        let time = 0;
        let animationId: number | null = null;

        function animate() {
          // Check if element is still in the DOM
          if (!container.isConnected) {
            if (animationId !== null) {
              cancelAnimationFrame(animationId);
              animationId = null;
            }
            document.removeEventListener('mousemove', handleMouseMove);
            return;
          }

          // Smooth mouse movement
          const ease = 0.08;
          mouseX += (targetMouseX - mouseX) * ease;
          mouseY += (targetMouseY - mouseY) * ease;

          // Calculate mouse influence
          const mouseInfluence = Math.abs(mouseY - 0.5) * 2;

          // Update each wave path
          waves.forEach(wave => {
            const pathElement = svgElement.querySelector(`#${wave.id}`) as SVGPathElement;
            if (pathElement) {
              pathElement.setAttribute('d', generateWavePath(wave, mouseInfluence, mouseX, mouseY, time));
            }
          });

          time++;
          animationId = requestAnimationFrame(animate);
        }

        function handleMouseMove(event: MouseEvent) {
          const rect = container.getBoundingClientRect();
          targetMouseX = (event.clientX - rect.left) / rect.width;
          targetMouseY = (event.clientY - rect.top) / rect.height;
        }

        // Add mouse move listener
        document.addEventListener('mousemove', handleMouseMove);

        // Start animation
        animate();
      }, 0);
    }
  );
}
