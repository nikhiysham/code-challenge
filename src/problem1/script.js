var sum_to_n_a = function (n) {
  // For loop
  var sum = 0;
  for (var idx = 1; idx <= n; idx++) {
    sum += idx;
  }
  return sum;
};

// Output (n=3)
// Initial value | After value
// idx=1, idx<=n = true, sum=0 | sum=1+0=1
// idx=2, idx<=n = true, sum=1 | sum=2+1=3
// idx=3, idx<=n = true, sum=3 | sum=3+3=6

// --------------------------------------
var sum_to_n_b = function (n) {
  // While loop
  var sum = 0;

  while (n > 0) {
    sum += n;
    n--;
  }
  return sum;
};

// Output (n=3)
// Initial value | After value
// 1) n=3, sum=0,| n=2 ,sum=3+0=3
// 2) n=2, sum=3 | n=1, sum=3+2=5
// 3) n=1, sum=5 | n=0, sum=5+1=6
// --------------------------------------

var sum_to_n_c = function (n) {
  // Use ES6 (ES2015)
  return Array.from({ length: n }, (_, idx) => idx + 1).reduce(
    (acc, val) => acc + val,
    0,
  );
};

// Output (n=3)
// Start: acc = 0
// Step 1: acc = 0 + 1 = 1
// Step 2: acc = 1 + 2 = 3
// Step 3: acc = 3 + 3 = 6
