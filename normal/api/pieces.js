class Pieces {
    constructor() {
        this.pieces = [
            // Pièce I
            [
                [
                    [1, 1, 1, 1]
                ],
                [
                    [1],
                    [1],
                    [1],
                    [1]
                ],
                [
                    [1, 1, 1, 1]
                ],
                [
                    [1],
                    [1],
                    [1],
                    [1]
                ]
            ],

            // Pièce J
            [
                [
                    [1, 0, 0],
                    [1, 1, 1]
                ],
                [
                    [1, 1],
                    [1, 0],
                    [1, 0]
                ],
                [
                    [1, 1, 1],
                    [0, 0, 1]
                ],
                [
                    [0, 1],
                    [0, 1],
                    [1, 1]
                ]
            ],

            // Pièce L
            [
                [
                    [0, 0, 1],
                    [1, 1, 1]
                ],
                [
                    [1, 0],
                    [1, 0],
                    [1, 1]
                ],
                [
                    [1, 1, 1],
                    [1, 0, 0]
                ],
                [
                    [1, 1],
                    [0, 1],
                    [0, 1]
                ]
            ],

            // Pièce O
            [
                [
                    [1, 1],
                    [1, 1]
                ],
                [
                    [1, 1],
                    [1, 1]
                ],
                [
                    [1, 1],
                    [1, 1]
                ],
                [
                    [1, 1],
                    [1, 1]
                ]
            ],

            // Pièce S
            [
                [
                    [0, 1, 1],
                    [1, 1, 0]
                ],
                [
                    [1, 0],
                    [1, 1],
                    [0, 1]
                ],
                [
                    [0, 1, 1],
                    [1, 1, 0]
                ],
                [
                    [1, 0],
                    [1, 1],
                    [0, 1]
                ]
            ],

            // Pièce T
            [
                [
                    [0, 1, 0],
                    [1, 1, 1]
                ],
                [
                    [1, 0],
                    [1, 1],
                    [1, 0]
                ],
                [
                    [1, 1, 1],
                    [0, 1, 0]
                ],
                [
                    [0, 1],
                    [1, 1],
                    [0, 1]
                ]
            ],

            // Pièce Z
            [
                [
                    [1, 1, 0],
                    [0, 1, 1]
                ],
                [
                    [0, 1],
                    [1, 1],
                    [1, 0]
                ],
                [
                    [1, 1, 0],
                    [0, 1, 1]
                ],
                [
                    [0, 1],
                    [1, 1],
                    [1, 0]
                ]
            ]
        ];
    }

    getRandomPiece() {
        const randomIndex = Math.floor(Math.random() * this.pieces.length);
        const randomPieces = this.pieces[randomIndex];
        const randomPiece = randomPieces[Math.floor(Math.random() * 4)];
        return randomPiece;
    }

	getallPiece()
	{
		let randomPiece = [];
		const pieces = new Pieces();
        for (let i = 0; i < 2000; i++) {
            randomPiece.push(pieces.getRandomPiece());
		}
	return randomPiece
	}
}

module.exports = Pieces;
