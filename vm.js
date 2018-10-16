function makeEnum(array) {
    return array.reduce((pre, name, index) => {
        pre[name] = index;
        return pre;
    }, {});
}

const InstructionSet = makeEnum(['HLT', 'PSH', 'ADD', 'POP', 'SET', 'GET']);

const Registers = makeEnum(['A', 'B', 'C', 'D', 'E', 'F', 'IP']);

class VM {
    constructor() {
        this.reset();
        this.isRunning = false;
        const self = this;
        function getRegName() {
            const regName = self.fetch();
            if (Registers[regName] === undefined) {
                throw `Could not get register '${regName}'`;
            }
            return regName;
        }
        this.instrumentHandlers = {
            HLT() {
                self.isRunning = false;
            },
            PSH() {
                self.stack.push(self.fetch());
            },
            POP() {
                console.log(self.stack.pop());
            },
            ADD() {
                self.stack.push(self.stack.pop() + self.stack.pop());
            },
            SET() {
                self.registers[getRegName()] = self.fetch();
            },
            GET() {
                console.log(self.registers[getRegName()]);
            }
        }
    }

    eval(instrument) {
        const handler = this.instrumentHandlers[instrument];
        if (handler === undefined) {
            throw `Invalid instrument '${instrument}'`;
        }
        handler();
    }
    reset() {
        this.ip = 0;
        this.stack = [];
        this.registers = {};
    }
    fetch() {
        return this.instruments[this.ip++];
    }
    execute(instruments) {
        this.reset();
        this.instruments = instruments;
        this.isRunning = true;
        while (this.isRunning) {
            const instrument = this.fetch();
            if (!instrument) {
                this.isRunning = false;
            }
            this.eval(instrument);
        }
    }
}

// test
const program = [
    'PSH', 5,       // pushes 5 to the stack
    'PSH', 10 ,     // pushes 10 to the stack
    'ADD',         // pops two values on top of the stack, adds them pushes to stack
    'POP',         // pops the value on the stack, will also print it for debugging
    'SET', 'A', 0,     // sets register A to 0
    'GET', 'A',        // gets the value of register A
    'HLT'         // stop the program
];

const vm = new VM();
vm.execute(program);
