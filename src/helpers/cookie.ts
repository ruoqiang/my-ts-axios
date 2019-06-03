const cookie = {
  read(name: string): string | null {
    const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)')) // 正则表达式解析 name 对应的值
    return match ? decodeURIComponent(match[3]) : null
  }
}
export default cookie
