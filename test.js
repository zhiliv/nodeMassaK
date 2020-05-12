const getData =  () => {
  return  new Promise((resolve, rejected) => {
    setTimeout(() => {
      resolve('')
    }, 1000);
  })
}


const getResult = async () => {
  const arr = ['data1', 'data2']
  const res = []
  console.time('start')
  for(const i of arr){
    var r = await getData().then(res => {
    console.log('getResult -> res', res)
      r= res
    })
    res.push(r)
  }
    if(res[0]){
      console.log(res.join('+'))
      console.timeEnd('start')
    }
    else if(res[1]){
      console.log(res.join('-'))
      console.timeEnd('start')
    }
    else{
      console.log('Упс')
      console.timeEnd('start')
    }

}

getResult()



