class TimeTool {
  /**
   * 转化耗时为易读性结构结构
   * @param duration 耗时(毫秒)
   * @returns 易读性结构
   */
  public formatDuration(duration: number): string {
    if (duration < 1000) {
      return `${duration}毫秒`;
    }
    const seconds = Math.floor((duration / 1000) % 60);
    const minutes = Math.floor((duration / (1000 * 60)) % 60);
    const hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
    const days = Math.floor(duration / (1000 * 60 * 60 * 24));

    if (days > 0) {
      return `${days}天${hours}小时${minutes}分${seconds}秒`;
    }
    if (hours > 0) {
      return `${hours}小时${minutes}分${seconds}秒`;
    }
    if (minutes > 0) {
      return `${minutes}分${seconds}秒`;
    }
    return `${seconds}秒`;
  }

  /**
   * 获取中国时间
   * @param now 时间 默认当前时间
   * @returns 时间显示格式
   */
  public getNowChinaTimeStr(): string {
    return new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });
  }
}

export const timeTool = new TimeTool();
