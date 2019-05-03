// Created by Wojtek@

window.onload = function() {
	starter.start();
};



var starter = {
	start: function() {
		this.tableCreator.createTable();
		this.fillSquareEventsAdder.addFillSquareEvents();

		if (supportsLocalStorage()) {
			if (localStorage.getItem("savedSudoku") !== null) {
				$("#resumeGameButton, #resumeGameButton + br").show();
			}
		}
	},


	tableCreator: {
		createTable: function() {
			for (var i=0; i<3; i++) {
				var newBlockRow = $("<tr></tr>");

				for (var j=0; j<3; j++) {
					var newBlockContainer = $("<td></td>").addClass("blockContainer");
					var newBlock = $("<table></table>").addClass("block");
					$(newBlockContainer).append(newBlock);

					for (var k=0; k<3; k++) {
						var newSquareRow = $("<tr></tr>");

						for (var l=0; l<3; l++) {
							var newSquare = $("<td></td>").addClass("square");
							var numberContainer = $("<span></span>").addClass("numberContainer");
							$(newSquare).append(numberContainer);
							$(newSquareRow).append(newSquare);
						}

						$(newBlock).append(newSquareRow);
					}

					$(newBlockRow).append(newBlockContainer);
				}

				$("#sudokuTable").append(newBlockRow);
			}

			this.assignIDs();
		},
		
		assignIDs: function() {
			var counter = 0;

			for (var row=0;row<9;row++) {
				for (var column=0;column<9;column++) {
					$(selector.selectRow(row)[column]).attr("id", "s" + counter);
					counter++;
				}
			}
		}
	},



	fillSquareEventsAdder: {
		addFillSquareEvents: function() {
			$(window).on("keypress", function(e) {
				var fillNumber = parseInt(String.fromCharCode(e.which));
				if (fillNumber >= 1 && fillNumber <= 9) {
					starter.fillSquareEventsAdder.fillSelectedSquare(fillNumber);
				}
				else {
					starter.fillSquareEventsAdder.fillSelectedSquare("");
				}
			});

			$("#fillButtonContainer > button").on("click", function(e) {
				var fillNumber = $(e.target).text();
				if (fillNumber == "X") {
			fillNumber = "";
				}
				starter.fillSquareEventsAdder.fillSelectedSquare(fillNumber);
			});
		},
		
		fillSelectedSquare: function(number) {
			$(".square.selected").children(".numberContainer").text(number);
		}
	}
};






var sudokuCreator = {
	createSudoku: function(difficulty) {
		this.unfillTable();
		this.fillTable();

		$("#progressPopup").show();
		this.emptyCellsAdder.addEmptyCells(0, difficulty);


		/*var startTime = new Date().getTime();
		var endTime;
		var sudokuCreateTime;
		endTime = new Date().getTime();
		sudokuCreateTime = endTime - startTime;
		$("#timeLable").text("Zeit zum Generieren: " + sudokuCreateTime + "ms");*/
	},

	unfillTable: function() {
		$("#sudokuTable .numberContainer").text("-").attr("data-not-possible", "[]").css("background-color", "");
		$("#sudokuTable .square").css("background-color", "").removeClass("changable selected").off("click");
	},

	fillTable: function() {
		for (var fillCounter = 0; fillCounter < 81; fillCounter++) {
			var row = Math.floor(fillCounter/9);
			var column = fillCounter % 9;
			var block = Math.floor(column/3) + Math.floor(row/3)*3;

			var possibleNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
			var otherNotPossibleNumbers;


			var squaresInRow = selector.selectRow(row);
			for (var k=0;k<squaresInRow.length;k++) {
				var squareValue = parseInt($(squaresInRow[k]).text());

			var index = possibleNumbers.indexOf(squareValue);
			if (index > -1) {
				possibleNumbers.splice(index, 1);
			}
		}

			var squaresInColumn = selector.selectColumn(column);
			for (var k=0;k<squaresInColumn.length;k++) {
				var squareValue = parseInt($(squaresInColumn[k]).text());

				var index = possibleNumbers.indexOf(squareValue);
				if (index > -1) {
					possibleNumbers.splice(index, 1);
				}
			}

			var squaresInBlock = selector.selectBlock(block);
			for (var k=0;k<squaresInBlock.length;k++) {
				var squareValue = parseInt($(squaresInBlock[k]).text());

				var index = possibleNumbers.indexOf(squareValue);
				if (index > -1) {
					possibleNumbers.splice(index, 1);
				}
			}



			if (typeof $("#s" + fillCounter).attr("data-not-possible") == "undefined") {
				otherNotPossibleNumbers = [];
			}
			else {
				otherNotPossibleNumbers = JSON.parse($("#s" + fillCounter).attr("data-not-possible"));
			}
			for (var k=0;k<otherNotPossibleNumbers.length;k++) {
				var index = possibleNumbers.indexOf(otherNotPossibleNumbers[k]);
				if (index > -1) {
					possibleNumbers.splice(index, 1);
				}
			}




			if (possibleNumbers.length === 0) {
				$("#s" + fillCounter).text("-").attr("data-not-possible", "[]");

				fillCounter -= 1;

				var notPossibleNumbers = [];

				var oldNotPossibleNumbers = $("#s" + fillCounter).attr("data-not-possible");

				if (typeof oldNotPossibleNumbers !== "undefined") {
					oldNotPossibleNumbers = JSON.parse(oldNotPossibleNumbers);
					for (var i=0;i<oldNotPossibleNumbers.length;i++) {
						if (notPossibleNumbers.indexOf(oldNotPossibleNumbers[i]) == -1) {
							notPossibleNumbers.push(oldNotPossibleNumbers[i]);
						}
					}
				}

				var previousSquareNumber = parseInt($("#s" + fillCounter).text());

				if (notPossibleNumbers.indexOf(previousSquareNumber == -1)) {
					notPossibleNumbers.push(previousSquareNumber);
				}

				$("#s" + fillCounter).attr("data-not-possible", JSON.stringify(notPossibleNumbers));

				fillCounter -= 1;
			}

			else {
				var randomNumber = possibleNumbers[randint(0, possibleNumbers.length - 1)];
				$("#s" + fillCounter).text(randomNumber);
			}
		}
	},



emptyCellsAdder: {
		addEmptyCells: function(counter, tries) {
			popup.openWithId("#progressPopup");
			$("#progressBar > span").text(Math.round((counter/tries)*100) + "%");
			$("#progressBar > span").css("width", Math.round((counter/tries)*100) + "%");

			var randomNumber = randint(0, 80);
			var number = parseInt($("#s" + randomNumber).text());

			$("#s" + randomNumber).text("").parent().addClass("changable");

			if (!solveSudoku()) {
				$("#s" + randomNumber).text(number);
				$("#s" + randomNumber).parent().removeClass("changable");
				$(".removable").remove();
			}
			$(".changable > .numberContainer").text("");

			counter++;
			if (counter<tries) {
				setTimeout(function() {
					sudokuCreator.emptyCellsAdder.addEmptyCells(counter, tries);
				}, 0);
			}
			else {
				sudokuCreator.emptyCellsAdder.addEmptyCellEvents();
				$("#startMenu, #progressPopup, .overlay").fadeOut(200);
			}
		},

		addEmptyCellEvents: function() {
			$(".changable").on("click", function(e) {
				if ($(e.target).closest(".square").hasClass("selected")) {
					$(".square").removeClass("selected");
					$(e.target).closest(".square").removeClass("selected");
				}
				else {
					$(".square").removeClass("selected");
					$(e.target).closest(".square").addClass("selected").removeClass("wrong");
				}
			});
		}
	}
}







function checkSudoku() {
	var errorCount = 0;
	var allFilled = true;

	for (var i=0;i<$(".changable").length;i++) {
		var number = $(".changable").eq(i).children(".numberContainer").text();

		if (number == "") {
			allFilled = false;
		}
		
		number = parseInt(number);


		var id = $(".changable").eq(i).children(".numberContainer").attr("id").split("s")[1];
		var row = selector.selectRow(Math.floor(id/9));
		var column = selector.selectColumn(Math.floor(id % 9));
		var block = selector.selectBlock(Math.floor(column/3) + Math.floor(row/3)*3);

		var notPossibleNumbers = [];


		for (var j=0;j<9;j++) {
			if ($(row[j])[0] !== $(".changable").eq(i).children(".numberContainer")[0]) {
				var squareText = parseInt($(row[j]).text());
				if (notPossibleNumbers.indexOf(squareText) == -1 && !isNaN(squareText)) {
					notPossibleNumbers.push(squareText);
				}
			}
			if ($(column[j])[0] !== $(".changable").eq(i).children(".numberContainer")[0]) {
				var squareText = parseInt($(column[j]).text());
				if (notPossibleNumbers.indexOf(squareText) == -1 && !isNaN(squareText)) {
					notPossibleNumbers.push(squareText);
				}
			}
			if ($(block[j])[0] !== $(".changable").eq(i).children(".numberContainer")[0]) {
				var squareText = parseInt($(block[j]).text());
				if (notPossibleNumbers.indexOf(squareText) == -1 && !isNaN(squareText)) {
					notPossibleNumbers.push(squareText);
				}
			}
		}

		
		if (notPossibleNumbers.indexOf(number) >= 0) {
			$(".changable").eq(i).addClass("wrong");
			errorCount++;
		}
		else {
			$(".changable").eq(i).css("background-color", "");
		}
	}
	
	if (allFilled == true && errorCount == 0) {
		popup.open("Congratulations!", "You have solved this sudoku!");
	}
	else {
		popup.open("Verification finished", errorCount + " Errors found.");
	}

	$(".selected").removeClass("selected");
}








function solveSudoku() {
	while(squaresToFill() > 0) {
		var solvable = false;

		for (var i=0;i<$(".changable").length;i++) {
			var id = $(".changable").eq(i).children(".numberContainer").attr("id").split("s")[1];
			var row = selector.selectRow(Math.floor(id/9));
			var column = selector.selectColumn(Math.floor(id % 9));
			var block = selector.selectBlock(Math.floor(Math.floor(id % 9)/3) + Math.floor(Math.floor(id/9)/3)*3);

			var possibleNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];


			for (var j=0;j<9;j++) {
				var squares = [$(row[j]), $(column[j]), $(block[j])];

				for (var k=0;k<squares.length;k++) {
					var squareRowText = parseInt($(squares[k]).text());
					var possibleNumbersIndex = possibleNumbers.indexOf(squareRowText);
					if (possibleNumbersIndex > -1) {
						possibleNumbers.splice(possibleNumbersIndex, 1);
					}
				 }
			}

			if (possibleNumbers.length == 1) {
				$(".changable").eq(i).children(".numberContainer").text(possibleNumbers[0]);
				solvable = true;

				/*if (hint) {
					return true;
				}*/
			}
		}

		if (!solvable) {
			popup.open("Error", "This sudoku doesn't have a unique solution.");
			return false;
		}
	}
	return true;
}




function squaresToFill() {
	var squaresToFill = 0;

	for (var i=0;i<$(".changable").length;i++) {
		if ($(".changable").eq(i).text() == "") {
			squaresToFill++;
		}
	}

	return squaresToFill;
}





var data = {
	save: function() {
		if (typeof(Storage) == "undefined") {
			popup.open("Error", "Web Storage API is not supported by your browser.")
			//alert("Web Storage API wird von ihrem Browser nicht unterstützt.");
			return false;
		}

		var sudokuList = [];

		for (var i=0;i<9;i++) {
			var rowList = [];
			var row = selector.selectRow(i);

			for (var j=0;j<row.length;j++) {
				var square = {};
				square.value = $(row[j]).text();
				square.changable = $(row[j]).parent(".square").hasClass("changable");

				rowList.push(square);
			}

			sudokuList.push(rowList);
		}

		if (supportsLocalStorage()) {
			localStorage.setItem("savedSudoku", JSON.stringify(sudokuList));
	}
	},

	load: function() {
		if (typeof(Storage) == "undefined") {
			popup.open("Error", "Web Storage API is not supported by your browser.")
			//alert("Web Storage API wird von ihrem Browser nicht unterstützt.");
			return false;
		}

		if (supportsLocalStorage()) {
			var savedSudokuList = JSON.parse(localStorage.getItem("savedSudoku"));
	}
		
		if (savedSudokuList == null) {
			popup.open("Error", "Couldn't find existing data.")
			//alert("Keine Daten gefunden.");
			return false;
		}

		sudokuCreator.unfillTable();

		for (var i=0;i<9;i++) {
			var rowList = selector.selectRow(i)
			var savedRow = savedSudokuList[i];

			for (var j=0;j<rowList.length;j++) {
				var square = rowList[j];
				$(square).text(savedRow[j].value);

				if (savedRow[j].changable) {
					$(square).parent(".square").addClass("changable");
				}
			}
		}
		sudokuCreator.emptyCellsAdder.addEmptyCellEvents();
	},

	reset: function() {
		if (typeof(Storage) == "undefined") {
			popup.open("Error", "Web Storage API is not supported by your browser.")
			//alert("Web Storage API wird von ihrem Browser nicht unterstützt.");
			return false;
		}
		
		if (supportsLocalStorage()) {
			var savedSudokuList = JSON.parse(localStorage.getItem("savedSudoku"));
		}
	}
}









var selector = {
	selectRow: function (row) {
		var squaresList = [];

		var blockRow = $("#sudokuTable").children("tr").eq(Math.floor(row/3));
		var blocks = $(blockRow).children("td").children("table");

		$(blocks).each(function() {
			var squareRows = $(this).children("tr").eq(row%3);

			var squares = $(squareRows).children("td").children(".numberContainer");

			squaresList.push.apply(squaresList, $.makeArray(squares));
		});

		return squaresList;
	},

	selectColumn: function (column) {
		var squaresList;
		var blocks = $("#sudokuTable > tr > td:nth-child(3n+" + (Math.floor(column/3) + 1) + ")").children("table");

		var squares = $(blocks).children("tr").children("td:nth-child(3n+" + (Math.floor(column%3) + 1) + ")").children(".numberContainer");

		squaresList = $.makeArray(squares);

		return squaresList;
	},

	selectBlock: function (block) {
		var squaresList;
		var blocks = $("#sudokuTable").children("tr").children("td").children("table").eq(block);
		var squares = $(blocks).children("tr").children("td").children(".numberContainer");

		squaresList = $.makeArray(squares);

		return squaresList;
	}
};






var popup = {
	open: function(title, content) {
		var overlay = $("<div class='overlay removable' onclick='popup.close()'></div>");

		var popup = $(
			"<div class='popup removable'>" +
				"<h2></h2>" +
				"<p></p>" +
				"<button onclick='popup.close()'>Okay</button>" +
			"</div>"
		);

		$(popup).find("h2").text(title);
		$(popup).find("p").text(content);

		$("body").append(popup, overlay);
		$(popup).show();
		$(overlay).show();
	},

	openWithId: function(id) {
		$(id + ", .overlay").show();
	},
	
	close: function() {
		$(".popup, .overlay").fadeOut(200);
		setTimeout(function() {
			$(".removable").remove();
		}, 300)
	}
}



function supportsLocalStorage() {
	try {
		return 'localStorage' in window && window['localStorage'] !== null;
	} catch(e) {
		popup.open("Error","LocalStorage is not supported by your browser. Features like saving and loading sudokus won't work properly.");
		return false;
	}
}



function randint(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}