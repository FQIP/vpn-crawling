const p1 = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('p1......')
    }, 1000)
  })
}

const p2 = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject('p2.....')
    }, 500)
  })
}

const p3 = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject('p3......')
    }, 1000)
  })
}

let r = null

const run = async () => {
  try {
    const result = await Promise.allSettled([p1(), p2()])
    console.log('result-----------------', result)
    await p3()
  } catch (error) {
    console.log('error-------------------', error)
    throw error
  } finally {
    console.log('finall-----------------', r)
  }
  // const result = await Promise.allSettled([p1(), p2()])
  // console.log('result-----------------', result)
  // await p3()
}

r = run()

r.then((res) => {
  console.log('then>>>>>>>>>>>', res)
})
  .catch((err) => {
    console.log('catch>>>>>>>>>>>>>', err)
  })
  .finally((res) => {
    console.log('finally>>>>>>>>>>>', res)
  })
