document.addEventListener("DOMContentLoaded", () => {
    const addEventButton = document.getElementById("addEventButton");
    const eventsContainer = document.getElementById("events");
    const storedEvents = JSON.parse(localStorage.getItem("events")) || [];

    const createEventElement = eventData => {
        const eventElement = document.createElement("div");
		
		//format time to be "Month Day, Year - Hour:Minute AM/PM"
		const eventTime = new Date(eventData.time);
		const timeRefinement = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit' };
		const formattedTime = eventTime.toLocaleDateString('en-US', timeRefinement).replace(' at ', ' - ');
		
        eventElement.className = "event";
        eventElement.innerHTML = `
            <h3>${eventData.name}</h3>
            <p>${eventData.description}</p>
            <p>${formattedTime}</p>
            <div class="countdown" data-time="${eventData.time}"></div>
			<button class="delete-event">X</button>
			<button class="edit-event">Edit</button>
        `;
        eventsContainer.appendChild(eventElement);

        const deleteButton = eventElement.querySelector(".delete-event");
        deleteButton.addEventListener("click", () => {
            const eventName = eventData.name;
            eventElement.remove();

            const eventIndex = storedEvents.findIndex(event => event.name === eventName);
            if (eventIndex !== -1) {
                storedEvents.splice(eventIndex, 1);
                localStorage.setItem("events", JSON.stringify(storedEvents));
            }
        });
	
		const editButton = eventElement.querySelector(".edit-event");
		editButton.addEventListener("click", () => {
			document.getElementById("eventName").value = eventData.name;
			document.getElementById("eventDesc").value = eventData.description;
			const eventTime = new Date(eventData.time);
			document.getElementById("eventTime").value = eventTime.toISOString().slice(0, 16);
           
			
			// Remove the edited event from the storedEvents array
			const eventIndex = storedEvents.findIndex(event => event.name === eventData.name);
			if (eventIndex !== -1) {
				storedEvents.splice(eventIndex, 1);
				localStorage.setItem("events", JSON.stringify(storedEvents));
				eventElement.remove();
            }
        });
    };

    storedEvents.sort((a, b) => a.time - b.time);
    storedEvents.forEach(createEventElement);

    addEventButton.addEventListener("click", () => {
        const eventName = document.getElementById("eventName").value;
        const eventDesc = document.getElementById("eventDesc").value;
        const eventTime = new Date(document.getElementById("eventTime").value);

        if (eventName && eventTime) {
            const eventData = { name: eventName, description: eventDesc, time: eventTime.getTime() };
            storedEvents.push(eventData);
            storedEvents.sort((a, b) => a.time - b.time);
            localStorage.setItem("events", JSON.stringify(storedEvents));

            eventsContainer.innerHTML = ""; // Clear the events container
            storedEvents.forEach(createEventElement);

            document.getElementById("eventName").value = "";
            document.getElementById("eventDesc").value = "";
            document.getElementById("eventTime").value = "";
        }
    });

    const updateCountdowns = () => {
        const now = new Date().getTime();
        const countdownElements = document.querySelectorAll(".countdown");

        countdownElements.forEach(countdownElement => {
            const eventTime = parseInt(countdownElement.getAttribute("data-time"));
            const timeRemaining = eventTime - now;

            const seconds = Math.floor(timeRemaining / 1000);
            const minutes = Math.floor(seconds / 60);
            const hours = Math.floor(minutes / 60);
            const days = Math.floor(hours / 24);
			const years = Math.floor(days / 365);

			const remainingDays = days % 365;
            const remainingHours = hours % 24;
            const remainingMinutes = minutes % 60;
            const remainingSeconds = seconds % 60;

            let countdownText = "";
			if (years > 0) {
				countdownText += `${years}y `;
			}
            if (remainingDays > 0) {
                countdownText += `${remainingDays}d `;
            }
            if (remainingHours > 0) {
                countdownText += `${remainingHours}h `;
            }
            if (remainingMinutes > 0) {
                countdownText += `${remainingMinutes}m `;
            }
			if (remainingSeconds > 0) {
				countdownText += `${remainingSeconds}s `;
			}

            countdownElement.textContent = countdownText;
			
			if (timeRemaining <= 0) {
				//dark red
				countdownElement.parentNode.style.backgroundColor = "#FF6666";
			} else if (timeRemaining <= 3600000) {
				//red
                countdownElement.parentNode.style.backgroundColor = "#FFB766";
            } else if (timeRemaining <= 86400000) {
				//orange
				countdownElement.parentNode.style.backgroundColor = "#FFF666";
			} else if (timeRemaining <= 604800000) {
				//yellow
				countdownElement.parentNode.style.backgroundColor = "#E1FF66";
			} else {
				//gray
               countdownElement.parentNode.style.backgroundColor = "#E4DFDF";
            }
        });
    };
	
    setInterval(updateCountdowns, 1000);
});