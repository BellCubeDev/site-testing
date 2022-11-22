const numToSpread = parseInt(process.argv[2])
if (!numToSpread) throw new Error('Please provide a number to spread')
const numberOfTimes = parseInt(process.argv[3] ?? '8')
const radix = parseInt(process.argv[4] ?? '16')

for (let i = 1; i <= numberOfTimes; i++) {
  console.log(Math.round((numToSpread/numberOfTimes) * i).toString(radix))
}