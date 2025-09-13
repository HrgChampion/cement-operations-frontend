export function fmt(n, decimals = 2) {
    if (n === null || n === undefined || Number.isNaN(n)) return "--";
    const num = Number(n);
    return num.toFixed(decimals);
  }
  
  export function fmtShort(n) {
    if (n === null || n === undefined) return "--";
    const num = Number(n);
    if (Math.abs(num) >= 1e6) return (num/1e6).toFixed(1) + "M";
    if (Math.abs(num) >= 1e3) return (num/1e3).toFixed(1) + "k";
    return num.toFixed(2);
  }
  