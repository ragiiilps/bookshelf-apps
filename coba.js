function secondMax(arr) {
  let max = Math.max.apply(null, arr);
  let a = arr.indexOf(max);

  arr[a] = 0;

  let maxi = Math.max.apply(null, arr);

  return console.log(maxi);
}
secondMax([12, 35, 1, 10, 34, 1]);
