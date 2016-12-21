'use babel'


export const getFileExtension = (name) => {
    let parts = name.split('.')
    let extension = parts[parts.length - 1]
    switch (extension) {
      case 'js': return 'file-text'
      case 'md': return 'book'
    }
    return 'file-text'
}
export const toggleDiff = () => {
    let e = document.getElementsByClassName('git-line-modified')
    let editor = document.getElementsByClassName('.line')
    let c = null

    for(c = 0; c < e.length; c++) {
      let n = e[c].getAttribute('data-screen-row')
      let lines = document.querySelectorAll('.line[data-screen-row="'+n+'"]')
      lines.classList.add('git-line-modified')
    }
}


export class Timelog {
    constructor() {
      this.times = [this.getTime()]
    }

    add() {
      return this.times.push(this.getTime())
    }

    start () {
      this.clear()
      return this.add()
    }

    stop() {
      this.add()
      let d = this.getDuration()
      this.clear()
      return d
    }

    clear() {
      let d = this.getDuration()
      this.times = []
      return d
    }

    getTime() {
      return new Date().getTime()
    }

    getDuration(unit='ms') {

      let units = {
        ms: 1,
        s:  1000,
        m:  1000 * 60,
        h:  1000 * 60 * 24, }

      return (
          this.times[this.times.length - 1] - this.times[0]
        ) / units[unit]
    }

    toString() {
      return this.times.join(", ")
    }
}
