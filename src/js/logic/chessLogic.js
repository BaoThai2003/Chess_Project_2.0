export const whitePieces = ["♔", "♕", "♖", "♗", "♘", "♙"];
     export const blackPieces = ["♚", "♛", "♜", "♝", "♞", "♟"];

     export function getInitialBoard() {
         return [
             ["♜", "♞", "♝", "♛", "♚", "♝", "♞", "♜"],
             ["♟", "♟", "♟", "♟", "♟", "♟", "♟", "♟"],
             ["", "", "", "", "", "", "", ""],
             ["", "", "", "", "", "", "", ""],
             ["", "", "", "", "", "", "", ""],
             ["", "", "", "", "", "", "", ""],
             ["♙", "♙", "♙", "♙", "♙", "♙", "♙", "♙"],
             ["♖", "♘", "♗", "♕", "♔", "♗", "♘", "♖"],
         ];
     }

     export function getValidQueenMoves(row, col, piece, boardState) {
         const moves = [];
         const isWhite = whitePieces.includes(piece);
         const directions = [
             [0, 1], [0, -1], [1, 0], [-1, 0],
             [1, 1], [1, -1], [-1, 1], [-1, -1]
         ];
         directions.forEach(([dr, dc]) => {
             let r = row + dr;
             let c = col + dc;
             while (r >= 0 && r < 8 && c >= 0 && c < 8) {
                 const targetPiece = boardState[r][c];
                 if (!targetPiece) {
                     moves.push([r, c]);
                 } else {
                     if ((isWhite && blackPieces.includes(targetPiece)) ||
                         (!isWhite && whitePieces.includes(targetPiece))) {
                         moves.push([r, c]);
                     }
                     break;
                 }
                 r += dr;
                 c += dc;
             }
         });
         return moves;
     }

     export function isKingInCheck(kingPos, boardState) {
         const [kingRow, kingCol] = kingPos;
         const isWhiteKing = boardState[kingRow][kingCol] === "♔";
         for (let row = 0; row < 8; row++) {
             for (let col = 0; col < 8; col++) {
                 const piece = boardState[row][col];
                 if (piece && (isWhiteKing ? blackPieces.includes(piece) : whitePieces.includes(piece))) {
                     let moves = [];
                     if (piece === "♕" || piece === "♛") moves = getValidQueenMoves(row, col, piece, boardState);
                     else if (piece === "♔" || piece === "♚") moves = getValidKingMoves(row, col, piece, boardState);
                     else if (piece === "♗" || piece === "♝") moves = getValidBishopMoves(row, col, piece, boardState);
                     else if (piece === "♖" || piece === "♜") moves = getValidRookMoves(row, col, piece, boardState);
                     else if (piece === "♙" || piece === "♟") moves = getValidPawnMoves(row, col, piece, boardState);
                     else if (piece === "♘" || piece === "♞") moves = getValidKnightMoves(row, col, piece, boardState);
                     if (moves.some(([r, c]) => r === kingRow && c === kingCol)) {
                         return true;
                     }
                 }
             }
         }
         return false;
     }

     export function isValidMove(fromRow, fromCol, toRow, toCol, piece, isWhiteTurn, boardState, whiteKingPos, blackKingPos) {
         const isWhitePiece = whitePieces.includes(piece);
         if (isWhiteTurn && !isWhitePiece || !isWhiteTurn && isWhitePiece) return false;

         let validMoves = [];
         if (piece === "♕" || piece === "♛") validMoves = getValidQueenMoves(fromRow, fromCol, piece, boardState);
         else if (piece === "♔" || piece === "♚") validMoves = getValidKingMoves(fromRow, fromCol, piece, boardState);
         else if (piece === "♗" || piece === "♝") validMoves = getValidBishopMoves(fromRow, fromCol, piece, boardState);
         else if (piece === "♖" || piece === "♜") validMoves = getValidRookMoves(fromRow, fromCol, piece, boardState);
         else if (piece === "♙" || piece === "♟") validMoves = getValidPawnMoves(fromRow, fromCol, piece, boardState);
         else if (piece === "♘" || piece === "♞") validMoves = getValidKnightMoves(fromRow, fromCol, piece, boardState);
         else return false;

         const isMoveValid = validMoves.some(([r, c]) => r === toRow && c === toCol);
         if (!isMoveValid) return false;

         const tempPiece = boardState[toRow][toCol];
         boardState[toRow][toCol] = piece;
         boardState[fromRow][fromCol] = "";
         const kingPos = (piece === "♔" || piece === "♚") ? [toRow, toCol] : (isWhitePiece ? whiteKingPos : blackKingPos);
         const kingInCheck = isKingInCheck(kingPos, boardState);
         boardState[fromRow][fromCol] = piece;
         boardState[toRow][toCol] = tempPiece;

         return !kingInCheck;
     }