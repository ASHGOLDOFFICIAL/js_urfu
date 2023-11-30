



class Registers {
    constructor() {
        this.ax = 0;
        this.bx = 0;
        this.cx = 0;
        this.dx = 0;

        this.ex = 0;
        this.fx = 0;
        this.gx = 0;
        this.hx = 0;

        this.pc = 0;
        this.fgs = {
            zf: 0,
        };
        Object.seal(this.fls);
    }
}


class Interpreter {
    constructor(mem, is) {
        this.regs = new Registers();
        this.mem = mem;
        this.on = false;
        this.instructions = is;
        
        Object.seal(this.regs);
        Object.seal(this.instructions);
    }

    getValue(arg) {
        if (arg.charAt(0) === '%')
            return this.regs[arg.slice(1)]
        return + arg;
    }

    putInReg(reg, val) {
        this.regs[reg.slice(1)] = val;
    }

    async run() {
        this.on = true;
        while (this.on) {
            const valueInMem = this.mem[ this.regs.pc ];
            const command = this.instructions[ valueInMem ];
            
            if (!command) throw new Error(`Syntax error: unknown command ${valueInMem}`);
            await command.call(this);
        }
    }
}

module.exports = { Interpreter };
