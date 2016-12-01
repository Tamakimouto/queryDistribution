function fact(n) {
    var total = 1;
    for (var x = n; x >= 2; x--)
        total *= x;
    return total;
}

function binCoeff(k, n) {
    return fact(k) / (fact(n) * fact(k - n));
}

function perm(k, n) {
    var num = fact(k);
    num /= fact(k - n);
    return num;
}

function stirling(k, n) {
    var num = 0;
    for (var x = 0; x <= n; x++)
        num += (Math.pow(-1, x) * binCoeff(n, x) * Math.pow((n - x), k));
    num *= (1/fact(n));
    return num;
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
            kMode: 0,
            n: 4,
            nMode: 0,
            modes: ["DISTINCT", "INDISTINCT"],
            option: 2,
            options: ["No Restrictions", "At Most 1", "At Least 1"]
        },
        computed: {
            result: function () {
                if (this.option == 0) {
                    if (!this.kMode && !this.nMode)
                        return Math.pow(this.n, this.k);
                    else if (this.kMode && !this.nMode)
                        return binCoeff(this.k + this.n - 1, this.n - 1);
                    else if (!this.kMode && this.nMode)
                        return incrementedStirling(this.k, this.n);
                    else if (this.kMode && this.nMode)
                        return "Sum of P(" + this.k + ", x) from x = 1 to n";
                } else if (this.option == 1) {
                    if (!this.kMode && !this.nMode)
                        return perm(this.n, this.k);
                    else if (this.kMode && !this.nMode)
                        return binCoeff(this.n, this.k);
                    else if (!this.kMode && this.nMode)
                        return this.k <= this.n ? 1 : 0;
                    else if (this.kMode && this.nMode)
                        return this.k <= this.n ? 1 : 0;
                } else if (this.option == 2) {
                    if (!this.kMode && !this.nMode)
                        return stirling(this.k, this.n) * fact(this.n);
                    else if (this.kMode && !this.nMode)
                        return binCoeff(this.k - 1, this.n - 1);
                    else if (!this.kMode && this.nMode)
                        return stirling(this.k, this.n);
                    else if (this.kMode && this.nMode)
                        return perm(this.k, this.n);
                }
            }
        }
    });
});
