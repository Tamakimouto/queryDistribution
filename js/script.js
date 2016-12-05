/**
 * script.js
 *
 * An educational client side web app to compute distribution problems.
 *
 * This app runs solely on client-side so there is no need for any set up,
 * just load ../index.html and you're good to go. Powered by Vue.js front-end framework.
 *
 * @author Anthony Zheng <Anthony@fopen-dream.space>
 */


/**
 * fact
 *
 * Calculates the factorial of a number
 *
 * @param   n       the integer to calculate the factorial of
 * @return  total   the computed factorial
 */
function fact(n) {
    var total = 1;
    for (var x = n; x >= 2; x--)
        total *= x;
    return total;
}


/**
 * binCoeff
 *
 * Calculates binomial coefficients, aka "k Choose n"
 *
 * This function is used when counting the number of ways to distribute
 * indistinct things into distinct containers.
 *
 * @param   k       the number of distributed objects
 * @param   n       the number of containers.
 * @return  val     the computed value based on the iterative, non-recursive formula
 *                  for binomial coefficients.
 */
function binCoeff(k, n) {
    var val = fact(k) / (fact(n) * fact(k - n));
    return val;
}


/**
 * perm
 *
 * Calculates a permutation.
 *
 * This is used when trying to count the number of ways to distribute
 * distinct objects into distinct containers and we want each container to
 * get no more than one object.
 *
 * @param   k       the number of objects.
 * @param   n       the number of containers.
 * @return  num     computed permutation.
 */
function perm(k, n) {
    var num = fact(k);
    num /= fact(k - n);
    return num;
}


/**
 * stirling
 *
 * Calculates the Stirling number of the 2nd kind given k, n.
 *
 * Used when dealing with indistinct containers where all containers get
 * at least one object.
 *
 * @param   k       the number of objects in the initial set.
 * @param   n       the number of subsets afterwards.
 * @return  num     computed Stirling Number.
 */
function stirling(k, n) {
    var num = 0;
    for (var x = 0; x <= n; x++)
        num += (Math.pow(-1, x) * binCoeff(n, x) * Math.pow((n - x), k));
    num *= (1/fact(n));
    return num;
}


/**
 * incrementedStirling
 *
 * Calculates the Stirling number of the 2nd kind given k for all
 * numbers of subsets from one up to a given n, and sums them up.
 *
 * Used when dealing with indistinct containers and distinct objects
 * but each container may have more than just one object.
 *
 * @param   k       the number of objects in the initial set.
 * @param   n       the max number of subsets.
 * @return  sum     the computed sum of Stirling Numbers.
 */
function incrementedStirling(k, n) {
    var sum = 0;
    for (var x = 1; x <= n; x++)
        sum += stirling(k, x);
    return sum;
}


/* Doc Ready */
$(function() {
    var app = new Vue({
        el: "#distributer",
        data: {
            /* This data is dynamically changed, manipulated, and displayed */
            head: "Distributing K into N things",
            imgName: "img/n2k.gif",
            k: 5,
            kMode: 0,
            n: 4,
            nMode: 0,
            modes: ["DISTINCT", "INDISTINCT"],
            option: 2,
            options: ["No Restrictions", "At Most 1", "At Least 1"]
        },
        computed: {
            /* Based on boolean data and int switches we go to the correct section */
            result: function () {
                if (this.option == 0) { // For No Restrictions
                    if (!this.kMode && !this.nMode) {
                        this.imgName = "img/n2k.gif";
                        return Math.pow(this.n, this.k);
                    } else if (this.kMode && !this.nMode) {
                        this.imgName = "img/kn1cn1.gif";
                        return binCoeff(this.k + this.n - 1, this.n - 1);
                    } else if (!this.kMode && this.nMode) {
                        this.imgName = "img/sumstir.gif";
                        return incrementedStirling(this.k, this.n);
                    } else if (this.kMode && this.nMode) {
                        this.imgName = "img/sumperm.gif";
                        return "Sum of P(" + this.k + ", x) from x = 1 to n";
                    }
                } else if (this.option == 1) { // For At Most 1
                    if (!this.kMode && !this.nMode) {
                        this.imgName = "img/npk.gif";
                        return perm(this.n, this.k);
                    } else if (this.kMode && !this.nMode) {
                        this.imgName = "img/nck.gif";
                        return binCoeff(this.n, this.k);
                    } else if (!this.kMode && this.nMode) {
                        this.imgName = "img/1or0.png";
                        return this.k <= this.n ? 1 : 0;
                    } else if (this.kMode && this.nMode) {
                        this.imgName = "img/1or0.png";
                        return this.k <= this.n ? 1 : 0;
                    }
                } else if (this.option == 2) { // For at least 1
                    if (!this.kMode && !this.nMode) {
                        this.imgName = "img/stir.gif";
                        return stirling(this.k, this.n) * fact(this.n);
                    } else if (this.kMode && !this.nMode) {
                        this.imgName = "img/k1cn1.gif";
                        return binCoeff(this.k - 1, this.n - 1);
                    } else if (!this.kMode && this.nMode) {
                        this.imgName = "img/stir.gif";
                        return stirling(this.k, this.n);
                    } else if (this.kMode && this.nMode) {
                        this.imgName = "img/part.gif";
                        return perm(this.k, this.n);
                    }
                }
            }
        }
    });
});


/**
 * starsAndBars
 *
 * Enumerates the possible ways of distributing indistinct things distinct containers.
 * This function is not availible in the gui, and must be called manually.
 *
 * Usage: Call starsAndBars(k, n) in the web console.
 *
 * @param   objects     the number of objects
 * @param   containers  the number of containers
 * @return  result      An array of arrays of possible distributions.
 */
function starsAndBars(objects, containers) {
    if (objects == 0) {
        var result = [];
        for (var x = 0; x < containers; x++)
            result.push(0);
        return [result];
    } else if (!containers)
        return [];
    else if (containers == 1)
        return [[objects]];

    var result = [];

    starsAndBars(objects, containers - 1).forEach(function(arr) {
        arr.unshift(0);
        result.push(arr);
    });

    starsAndBars(objects - 1, containers).forEach(function(arr) {
        arr[0]++;
        result.push(arr);
    });

    return result;
}
