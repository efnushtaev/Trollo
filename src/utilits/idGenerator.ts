export const idGenerator = () => {
  let randomNumber: number[] = []
  for (let i = 0; i < 6; i++) {
    randomNumber.push(Math.floor(Math.random() * 10))
  }
  return Date.now() + 't' + randomNumber.join('')
}
