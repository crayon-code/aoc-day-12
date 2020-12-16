const fs = require('fs');

const instructions =
    fs.readFileSync('./input.txt', 'utf-8')
        .split("\n")
        .filter((line) => line)
        .map((encoded) => {
            return {
                action: encoded.substring(0, 1),
                length: 1 * encoded.substring(1),
            };
        });

function move(pos, dir, length) {
    return {
        x: pos.x + dir.x * length,
        y: pos.y + dir.y * length,
    }
}

const actions = {
    N(ship, length) {
        return Object.assign({}, ship, {
            pos: move(ship.pos, {
                x: 0, y: 1,
            }, length),
        });
    },
    S(ship, length) {
        return Object.assign({}, ship, {
            pos: move(ship.pos, {
                x: 0, y: -1,
            }, length),
        });
    },
    E(ship, length) {
        return Object.assign({}, ship, {
            pos: move(ship.pos, {
                x: 1, y: 0,
            }, length),
        });
    },
    W(ship, length) {
        return Object.assign({}, ship, {
            pos: move(ship.pos, {
                x: -1, y: 0,
            }, length),
        });
    },
    F(ship, length) {
        return Object.assign({}, ship, {
            pos: move(ship.pos, ship.dir, length),
        });
    },
    L(ship, angle) {
        return Object.assign({}, ship, {
            dir: turn(ship.dir, `L${angle}`)
        });
    },
    R(ship, angle) {
        return Object.assign({}, ship, {
            dir: turn(ship.dir, `R${angle}`)
        });
    },
};

const turners = {
    L90(dir) {
        return {
            x: dir.y,
            y: -1 * dir.x,
        };
    },
    R90(dir) {
        return {
            x: -1 * dir.y,
            y: dir.x,
        };
    },
    '180'(dir) {
        return {
            x: -1 * dir.x,
            y: -1 * dir.y,
        };
    },
};

function turn(dir, angle) {
    const map = {
        'R270': 'L90',
        'L270': 'R90',
        'L180': '180',
        'R180': '180',
    };

    if (angle in map) {
        angle = map[angle];
    }

    if (!(angle in turners)) {
        throw new Error(angle);
    }

    return turners[angle](dir);
}

function navigate(instructions) {
    const ship = {
        pos: {
            x: 0,
            y: 0,
        },
        dir: {
            x: 1,
            y: 0,
        },
    };

    let current = ship;
    instructions.forEach((instruction) => {
        const action = actions[instruction.action];
        current = action(current, instruction.length);
    });

    return current;
}

const ship = navigate(instructions);
const distance = Math.abs(ship.pos.x) + Math.abs(ship.pos.y);
console.log(distance);