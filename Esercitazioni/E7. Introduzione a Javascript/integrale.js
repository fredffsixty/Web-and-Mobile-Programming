function integral(integrand, [start, stop], nsamples) {
    var x = new Array(nsamples + 1);
    var step = (stop - start) / nsamples;

    for (let i = 0; i <= nsamples; i++)
        x[i] = i * step;

    return step * x.map(integrand).reduce((int, i) => int + i);
}