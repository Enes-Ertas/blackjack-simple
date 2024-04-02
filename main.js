var main = function () {
  //Global variables
  let cardNumbers = [
    "A",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "J",
    "Q",
    "K",
  ]
  let cardTypes = ["C", "D", "H", "S"]
  let cards = []
  let playerPoints = 0
  let dealerPoints = 0
  let aceCountPlayer = 0
  let aceCountDealer = 0
  let hiddenCard
  let canHit = false
  let isPlaying = false
  let isEndGame = false
  let isRevealed = false

  //Instead of defining them manually, I chose to define a function for it
  const loadCards = (cardNumbers, cardTypes) => {
    for (let i = 0; i < cardNumbers.length; i++) {
      for (let j = 0; j < cardTypes.length; j++) {
        cards.push(cardNumbers[i] + "-" + cardTypes[j])
      }
    }
  }
  //This function will return a random card for player.It will add the corresponding points to the player as well
  const addRandomCardPlayer = () => {
    let randomNumber = Math.floor(Math.random() * cards.length)
    let randomCard = cards[randomNumber]
    let pointsToAdd
    cards.splice(randomNumber, 1)
    pointsToAdd = randomCard.split("-")
    if (
      pointsToAdd[0] === "J" ||
      pointsToAdd[0] === "Q" ||
      pointsToAdd[0] === "K"
    ) {
      pointsToAdd[0] = "10"
    } else if (pointsToAdd[0] === "A") {
      pointsToAdd[0] = "11"
      aceCountPlayer++
    }
    playerPoints += parseInt(pointsToAdd[0])
    showPoints()
    return randomCard
  }
  //This function will return a random card for dealer.It will add the corresponding points to the dealer as well
  const addRandomCardDealer = () => {
    let randomNumber = Math.floor(Math.random() * cards.length)
    let randomCard = cards[randomNumber]
    let pointsToAdd
    cards.splice(randomNumber, 1)
    pointsToAdd = randomCard.split("-")
    if (
      pointsToAdd[0] === "J" ||
      pointsToAdd[0] === "Q" ||
      pointsToAdd[0] === "K"
    ) {
      pointsToAdd[0] = "10"
    } else if (pointsToAdd[0] === "A") {
      pointsToAdd[0] = "11"
      aceCountDealer++
    }
    dealerPoints += parseInt(pointsToAdd[0])
    showPoints()
    return randomCard
  }
  //After picking a random card, this function will add the corresponding image to the corresponding container
  const addImage = (card, container) => {
    card = card.split("-")
    let $img = $("<img>", {
      src: `./assets/${card[0]}-${card[1]}.png`,
      width: "100px",
      height: "175px",
    })
    $(`.${container}-container`).append($img)
  }

  //Dealer starts with a hidden card. I didnt want it to determine the card until the player wants to stay. So after player selects staying, addRandomDealer function will determine
  //a card for the dealer and assigns to the hidden card. This determined card will replace hidden card
  const hiddenCardReveal = () => {
    hiddenCard = addRandomCardDealer()
    $("#hidden-card").attr("src", `./assets/${hiddenCard}.png`)
  }

  //I used below function in setTimeOut in order to have a small delay (later I defined a delay function for it.It went better). Game starts with only play game button.
  const showHiddenCard = () => {
    $("#hidden-card").show()
  }

  //In order to update the points after each step. I defined a function for it and I used in other functions as last step
  const showPoints = () => {
    $("#player-points").text(playerPoints)
    $("#dealer-points").text(dealerPoints)
  }

  //In order to determine whether player can hit or not. I defined the following function
  const pointsCheck = () => {
    if (playerPoints > 21 && aceCountPlayer > 0) {
      playerPoints -= 10
      aceCountPlayer -= 1
      showPoints()
    } else if (dealerPoints > 21 && aceCountDealer > 0) {
      dealerPoints -= 10
      aceCountDealer -= 1
      showPoints()
    } else if (playerPoints > 21 && aceCountPlayer === 0) {
      canHit = false
      $("#player-points").text("You lose!")
      isEndGame = true
      $("#play-game").text("Play Again")
    }
  }

  //When the user selects staying. At the and this function will pick the winner
  const pickWinner = () => {
    if (dealerPoints > playerPoints && dealerPoints <= 21) {
      $("#player-points").text("You lose!")
    } else if (dealerPoints === playerPoints) {
      $("#player-points").text("Tie!")
    } else {
      $("#player-points").text("You win!")
    }
    isEndGame = true
    $("#play-game").text("Play Again")
  }
  //I took below function from web in order not to instantly add cards
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

  //This function will execute the dealer's moves after player chooses to stay
  const stay = async () => {
    if (dealerPoints <= 21 && isEndGame === false) {
      while (dealerPoints <= 17) {
        await delay(500)
        addImage(addRandomCardDealer(), "dealer")
        pointsCheck()
      }
      pickWinner()
    }
  }

  //When player clicks to 'play again' button, resetGame function will clear the area and resets the game to its initial position
  const resetGame = () => {
    cards = []
    playerPoints = 0
    dealerPoints = 0
    isRevealed = false
    isEndGame = false

    $(".dealer-container").empty()
    $(".player-container").empty()
    $("#dealer-points").text("0")
    $("#player-points").text("0")

    loadCards(cardNumbers, cardTypes)

    let $img = $("<img>", {
      src: "./assets/BACK.png",
      width: "100px",
      height: "175px",
      id: "hidden-card",
    })

    $(".dealer-container").append($img)
    playGame()
  }

  //playGame function will execute the game and put the initial cards to the board
  const playGame = () => {
    isPlaying = true
    loadCards(cardNumbers, cardTypes)
    $("#dealer-points").text(dealerPoints)
    $(".game-item").show()
    setTimeout(showHiddenCard, 500)
    setTimeout(() => {
      addImage(addRandomCardDealer(), "dealer")
    }, 1000)
    setTimeout(() => {
      addImage(addRandomCardPlayer(), "player")
    }, 1500)
    setTimeout(() => {
      addImage(addRandomCardPlayer(), "player")
    }, 2000)
    canHit = true
  }

  //'play game' button will start the game and if it is the end game, it will reset the game
  $("#play-game").on("click", () => {
    if (isPlaying === false) {
      playGame()
    } else if (isEndGame === true) {
      resetGame()
    }
  })

  //'hit' buton will put a new card for player if canHit is true
  $("#hit").on("click", () => {
    if (canHit) {
      addImage(addRandomCardPlayer(), "player")
      pointsCheck()
    } else {
      return
    }
  })

  //'stay' button will reveal the hidden card and execute the stay function
  $("#stay").on("click", () => {
    if (isRevealed === false && isEndGame === false) {
      hiddenCardReveal()
      isRevealed = true
    }
    stay()
  })
}

$(document).ready(main)
