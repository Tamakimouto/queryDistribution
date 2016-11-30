function fact(n) {
    var total = 1;
    for (var x = n; x >= 2; x--)
        total *= x;
    return total;
}

function binCoeff(k, n) {
    return fact(k) / (fact(n) * fact(k - n));
}

function stirling(k, n) {
    var x = k - n;
    var memo = [];

    for (var i = 0; i <= x; i++)
        memo[i] = 1;

    for (var i = 2; i <= n; i++) {
        for (var j = 1; j <= x; j++)
            memo[j] += i*memo[j-1];
    }

    return memo[x];
}

function incrementedStirling(k, n) {
    var sum = 0;
    for (var x = 1; x <= n; x++)
        sum += stirling(k, x);
    return sum;
}

$(function() {
    var app = new Vue({
        el: "#distributer",
        data: {
            head: "Distributing K into N things",
            k: 5,
            kMode: 1,
            n: 4,
            nMode: 1,
            modes: ["DISTINCT", "INDISTINCT"]
        },
        computed: {
            result: function () {
                if (!this.kMode && !this.nMode)
                    return Math.pow(this.n, this.k);
                else if (this.kMode && !this.nMode)
                    return binCoeff(this.k + this.n - 1, this.n - 1);
                else if (!this.kMode && this.nMode)
                    return incrementedStirling(this.k, this.n);
                else if (this.kMode && this.nMode)
                    return "P(" + this.k + ", " + this.n + ")";
            }
        }
    });
});
