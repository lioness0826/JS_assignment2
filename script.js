class WishManager {
    constructor() {
        this.wishData = {};
        this.deletedData = {};
        this.allData={};
    }

    // add a wish to the data object
    addWish(key, value) {
        this.wishData[key] = value;
        console.log("Wish Data:", this.wishData);
    }

    // Delete a wish and move to deleted data
    deleteWish(key) {
        if (this.wishData[key]) {
            this.deletedData[key] = this.wishData[key];
            delete this.wishData[key];
            console.log("Deleted Data:", this.deletedData);
        }
    }

    // Get all active wish data
    getAllWishes() {
        const list = Object.values(this.wishData);
        const listCopy=[...list];
        return listCopy;
    }

    // Merge active and deleted data
    getAllData() {
        this.allData={ ...this.wishData, ...this.deletedData};
       return this.allData;
    }
}



class UIManager {
    constructor(wishManager) {
        this.wishForm = document.getElementById("wishForm");
        this.wishInput = document.getElementById("wishInput");
        this.wishList = document.getElementById("wishList");
        this.wish = wishManager;
    }

    // Initialize form event listener
    eventListener() {
        this.wishForm.addEventListener("submit", (sub) => this.add(sub));
    }

    // Add wish to the UI and data manager
    add(sub) {
        sub.preventDefault();
        const wishText = this.wishInput.value.trim();
        if (wishText === "") {
            alert("Please enter a wish!");
            return;
        }

        const now = Date.now();
        this.wish.addWish(now, wishText);

        // Render the wish in the UI
        const newWish = this.createWishElement(now, wishText);
        this.wishList.appendChild(newWish);

        // Clear input field
        this.wishInput.value = "";
    }

  // Method to delete a wish
deleteWish(key, wishElement) {
    this.wish.deleteWish(key); // Update the data
    wishElement.remove(); // Update the UI
}

// Create a wish element in the UI
createWishElement(key, wishText) {
    const newWish = document.createElement("li");
    newWish.textContent = wishText;

    // Create and append remove button
    const removeButton = document.createElement("button");
    removeButton.textContent = "Remove";
    removeButton.classList.add("remove-btn");
    newWish.appendChild(removeButton);

    // Add event listener for removing the wish
    removeButton.addEventListener("click", () => {
        this.deleteWish(key, newWish); // Call the deleteWish method
    });

    return newWish;
}
}

const inspirationType = `{
    "1":"family",
    "2":"friends",
    "3":"career",
    "4":"self-promotion"
}`;


const inspiration = `{
    "family":"Visit intimate family menbers!",
    "friends":"Have a party!",
    "career":"Earn more than $100,000 a year!",
    "self-promotion":"Get a higher degree!"
}`;


class InspirationManager {
    constructor() {
        this.inspirationType = JSON.parse(inspirationType);
        this.inspiration = JSON.parse(inspiration);
        this.quoteDisplay = document.getElementById("quoteDisplay");
        this.inspirationalQuoteButton = document.getElementById("inspirationalQuoteButton");
    }

    // Initialize button listener
    initQuoteListener() {
        this.inspirationalQuoteButton.addEventListener("click", () => this.fetchWithAsync());
    }

    // Fetch inspirational quote
    async fetchWithAsync() {
        this.quoteDisplay.textContent = "Loading message...";
        try {
            const message = await this.fetchMessage();
            this.quoteDisplay.textContent = message;
        } catch (error) {
            console.error(error);
            this.quoteDisplay.textContent = "Could not fetch a message. Please try again later.";
        }
    }

    // Simulate fetching message with a Promise
    fetchMessage() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const fetchSuccess = Math.random() > 0.1;
                if (fetchSuccess) {
                    resolve(this.getInspiration());
                } else {
                    reject("Failed to fetch message.");
                }
            }, 2000);
        });
    }

    // Get a random inspirational quote
    getInspiration() {
        const index = Math.floor(Math.random() * 4) + 1;
        const key = this.inspirationType[index];
        return this.inspiration[key];
    }
}

class WishApp {
    constructor() {
        this.wishManager = new WishManager();
        this.uiManager = new UIManager(this.wishManager);
        this.inspirationManager = new InspirationManager();
    }

    init() {
        this.uiManager.eventListener();
        this.inspirationManager.initQuoteListener();
    }
}

class ExtendedWishApp extends WishApp {
    constructor() {
        super(); // call the constructor of the superclass
        this.sendButton = document.getElementById("send");
        this.sendListener();
    }

    sendListener() {
        this.sendButton.addEventListener("click", (event) => this.sendWish(event));
    }

    sendWish(event) {
        event.preventDefault();
        // Clear the input field
        this.uiManager.wishInput.value = "";

        // Clear the wish list
        while (this.uiManager.wishList.firstChild) {
            this.uiManager.wishList.removeChild(this.uiManager.wishList.firstChild);
        }
        console.log("Wishes sent successfully!");
        const all = this.wishManager.getAllData();
        console.log("data log: ",all);
    }

}

// Initialize the app
const extendedWishApp = new ExtendedWishApp();
extendedWishApp.init();



