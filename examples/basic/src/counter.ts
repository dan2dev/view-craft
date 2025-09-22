export function setupCounter(element: HTMLButtonElement) {
  let counter = 0
  const setCounter = (count: number) => {
    counter = count
    element.innerHTML = `count is ${counter}`
  }
  element.addEventListener('click', () => setCounter(counter + 1))
  setCounter(0)
}
// class Counter {
//   private count = 0
//   constructor() {
//     this.element.addEventListener('click', () => this.increment())
//     this.render()
//   }
//   private increment() {
//     this.count++
//     this.render()
//   }
//   private render() {
//     this.element.innerHTML = `count is ${this.count}`
//   }
// }