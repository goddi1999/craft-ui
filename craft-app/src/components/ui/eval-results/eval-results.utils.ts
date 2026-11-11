// TUFFUI (https://tuffui.com) · MIT License · Copyright (c) 2026 TUFFUI contributors
// Free to use. If it helps you, you can support it: https://ko-fi.com/yurigokoryan
const pct = (n: number) => `${(n * 100).toFixed(1)}%`

const formatCount = (v: number) => v.toLocaleString('en-US')

export { formatCount, pct }
