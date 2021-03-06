export class MasterLog {
    public static message = ""
    private static subscriptions: Array<any> = []
  
    public static log(message: string, title: string = ""): void {
      if(title) this.message += "\n " + title
      this.message += "\n " + message
      this.next()
    }
  
    public static subscribe(fn: (message: string) => any): void {
      this.subscriptions.push(fn)
    }
  
    public static next(): void {
      this.subscriptions.forEach(a => a(this.message))
    }
  }