// ——————————————————————————————————————————————————
// TextScramble, Credits: Justin Windle https://codepen.io/soulwire/pen/mEMPrK
// ——————————————————————————————————————————————————



class TextScramble {
    constructor(el) {
        this.el = el
        this.chars = ' '
        this.update = this.update.bind(this)
    }
    setText(newText) {
        const oldText = this.el.innerText
        const length = Math.max(oldText.length, newText.length)
        const promise = new Promise((resolve) => this.resolve = resolve)
        this.queue = []
        let num = 0;
        for (let i = 0; i < length; i++) {
            const from = oldText[i] || ''
            const to = newText[i] || ''
            const start = 20 + Math.floor(Math.random() * 40)
            const end = num
            num+=5 //this is the speed
            this.queue.push({ from, to, start, end })
        }
        cancelAnimationFrame(this.frameRequest)
        this.frame = 0
        this.update()
        return promise
    }

    setFastText(newText) {
        const oldText = this.el.innerText
        const length = Math.max(oldText.length, newText.length)
        const promise = new Promise((resolve) => this.resolve = resolve)
        this.queue = []
        let num = 0;
        for (let i = 0; i < length; i++) {
            const from = oldText[i] || ''
            const to = newText[i] || ''
            const start = 20 + Math.floor(Math.random() * 40)
            const end = num
            num += .09 //this is the speed
            this.queue.push({ from, to, start, end })
        }
        cancelAnimationFrame(this.frameRequest)
        this.frame = 0
        this.update()
        return promise
    }
    update() {
        let output = ''
        let complete = 0
        for (let i = 0, n = this.queue.length; i < n; i++) {
            let { from, to, start, end, char } = this.queue[i]
            if (this.frame >= end) {
                complete++
                output += to
            } else if (this.frame >= start) {
                if (!char || Math.random() < 0.28) {
                    char = this.randomChar()
                    this.queue[i].char = char
                }
                output += `<span class="dud">${char}</span>`
            } else {
                output += from
            }
        }
        this.el.innerHTML = output
        if (complete === this.queue.length) {
            this.resolve()
        } else {
            this.frameRequest = requestAnimationFrame(this.update)
            this.frame++
        }
    }
    randomChar() {
        return this.chars[Math.floor(Math.random() * this.chars.length)]
    }
}

// ——————————————————————————————————————————————————
// Example
// ——————————————————————————————————————————————————

const introPhrases = [
    'Welcome!',
    'Hello!',
    'Olà\n',
    'Glad you\'re here!',
    'Suilië',
]

const bodPhrases = "I'm Arika, a full stack developer studying Computer Science at University of Oklahoma." +
    " <br>I normally work with Java and C, dabbling in some web " +
    "development." +
    "<br>Currently, I'm in Sooner Competitive Robotics, focusing on Webprotocals, Docker, and Computer Vision."/* TODO how to get this to not overflow?*/

const bod = document.querySelector('.WelcomeText')
const fx_bod = new TextScramble(bod)

const intro = document.querySelector('.introBody')
const fx_intro = new TextScramble(intro)


let counter = Math.random() * introPhrases.length | 0
let prev = counter
let prevCounter =0

const next = () => {
    let tmp = Math.random() * introPhrases.length | 0;
    while (tmp === counter || tmp === prev)
        tmp = Math.random() * introPhrases.length | 0;

    counter = tmp
    prevCounter === 2 ? (prevCounter = 0, prev = counter) : ++prevCounter


    fx_bod.setText(introPhrases[counter]).then(() => {
        setTimeout(next, 7000)
    })
}

fx_intro.setFastText(bodPhrases).then(() => {
    setTimeout(next, 999999)
})

next()