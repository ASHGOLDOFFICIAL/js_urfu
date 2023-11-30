const readline = require('readline');


function readInput() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise(
        resolve => rl.question("", answer => {
            rl.close();
            resolve(answer);
        }
    ))
}


const animeIS = {
    え() { // stop execution
        this.on = false;
    },


    async いん＿いんて() { // wait for user input, store in register
        this.regs.pc += 2;
        const reg = this.mem[this.regs.pc - 1];
        this.putInReg.call(this,
            reg, + await readInput()
        );
    },
    もゔぇ() { // move value of one register to another
        this.regs.pc += 3;
        const reg = this.mem[this.regs.pc - 2];
        const val = this.getValue.call(this,
            this.mem[this.regs.pc - 1]
        );
        this.putInReg.call(this,
            reg, val
        );
    },
    かて() { // output content of register
        this.regs.pc += 2;
        const reg = this.mem[this.regs.pc - 1];
        console.log(this.getValue.call(
            this, reg
        ));
    },


    あでで() { // add value of one register to another
        this.regs.pc += 3;
        const reg1 = this.mem[this.regs.pc - 2];
        const reg2 = this.mem[this.regs.pc - 1];

        this.putInReg.call(this,
            reg1, this.getValue.call(this, reg1) +
                  this.getValue.call(this, reg2)
        )
    },
    すべ() { // substract value of one register from another
        this.regs.pc += 3;
        const reg1 = this.mem[this.regs.pc - 2];
        const reg2 = this.mem[this.regs.pc - 1];

        this.putInReg.call(this,
             reg1, this.getValue.call(this, reg1) -
                   this.getValue.call(this, reg2)
        )
    },
    むぇ() { // mul value of one register to another
        this.regs.pc += 3;
        const reg1 = this.mem[this.regs.pc - 2];
        const reg2 = this.mem[this.regs.pc - 1];

        this.putInReg.call(this,
             reg1, this.getValue.call(this, reg1) *
                   this.getValue.call(this, reg2)
        )
    },
    もで() { // get modulus
        this.regs.pc += 3;
        const reg1 = this.mem[this.regs.pc - 2];
        const reg2 = this.mem[this.regs.pc - 1];

        this.putInReg.call(this,
             reg1, this.getValue.call(this, reg1) %
                   this.getValue.call(this, reg2)
        )

    },
    いんせ() { // increment value of register
        this.regs.pc += 2;
        const reg = this.mem[this.regs.pc - 1];
        this.putInReg.call(this,
             reg, this.getValue.call(this, reg) + 1
        );
    },
    でせ() { // decrement value of register
        this.regs.pc += 2;
        const reg = this.mem[this.regs.pc - 1];
        this.putInReg.call(this,
             reg, this.getValue.call(this, reg) - 1
        );
    },
    みん() { // store in register smaller value
        this.regs.pc += 3;
        const reg1 = this.mem[this.regs.pc - 2];
        const reg2 = this.mem[this.regs.pc - 1];

        this.putInReg.call(this,
             reg1, Math.min(
                this.getValue.call(this, reg1),
                this.getValue.call(this, reg2)
             )
        )
    },
    まへ() {
        this.regs.pc += 3;
        const reg1 = this.mem[this.regs.pc - 2];
        const reg2 = this.mem[this.regs.pc - 1];

        this.putInReg.call(this,
             reg1, Math.max(
                this.getValue.call(this, reg1),
                this.getValue.call(this, reg2)
             )
        )
    },

        
    こぱれ() { // compare values in registers, put 1 in pws.zf if equal
        this.regs.pc += 3;
        const reg1 = this.mem[this.regs.pc - 2];
        const reg2 = this.mem[this.regs.pc - 1];
        this.regs.fgs.zf = + (
            this.getValue.call(this, reg1) ===
            this.getValue.call(this, reg2)
        );
    },
    pass() { // do nothing
        this.regs.pc += 1;
    },
    じゅめぺ() { // jump to label
        this.regs.pc = + this.mem[this.regs.pc + 1];
    },
    じゅくぇ() { // jump if equal
        this.regs.pc += 2;
        if (this.regs.fgs.zf !== 0)
            this.regs.pc = + this.mem[this.regs.pc - 1];
    },
    じゅねくぇ() { // jump if not equal
        this.regs.pc += 2;
        if (this.regs.fgs.zf === 0)
            this.regs.pc = + this.mem[this.regs.pc - 1];
    },
}

module.exports = { animeIS };
