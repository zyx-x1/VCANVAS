export const formatTime = (timeObj: object): string => {
  if (timeObj instanceof Date) {
    let y: number = timeObj.getFullYear();
    let m: number = timeObj.getMonth() + 1;
    let d: number = timeObj.getDate();
    let hh: string = timeObj
      .getHours()
      .toString()
      .padStart(2, "0");
    let mm: string = timeObj
      .getMinutes()
      .toString()
      .padStart(2, "0");
    let ss: string = timeObj
      .getSeconds()
      .toString()
      .padStart(2, "0");
    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
  } else {
    return "参数不是日期对象";
  }
};
