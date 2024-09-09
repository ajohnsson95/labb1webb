document.addEventListener('DOMContentLoaded', () => {
    const saveButtons = document.querySelectorAll('.save-btn');
    const savedTripsList = document.getElementById('saved-trips-list');
    const gridContainer = document.querySelector('.grid-container');

    function fetchTripsData() {
        fetch('../data/index.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Network response was not ok: ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => {
                data.forEach(trip => {
                    const listItem = document.createElement('div');
                    listItem.classList.add('destination-item');
                    listItem.innerHTML = `
                        <a href="${trip.name.toLowerCase()}.html">
                            <h2>${trip.name}</h2>
                            <img src="${trip.imageSrc}" alt="${trip.name}">
                        </a>
                        <p>${trip.description}</p>
                        <div class="rating">
                            <span class="star" data-value="1">&#9734;</span>
                            <span class="star" data-value="2">&#9734;</span>
                            <span class="star" data-value="3">&#9734;</span>
                            <span class="star" data-value="4">&#9734;</span>
                            <span class="star" data-value="5">&#9734;</span>
                        </div>
                        <input type="text" placeholder="Ditt namn" class="reviewer-name" pattern="[A-Za-zåäöÅÄÖ ]+" required title="Ange endast bokstäver och mellanslag">
                        <textarea placeholder="Skriv en recension" class="review-text" maxlength="200"></textarea>
                        <button class="save-btn" data-destination="${trip.name}">Spara Resa</button>
                    `;
                    gridContainer.appendChild(listItem);
                });
                addRatingEventListeners();
                addSaveButtonListeners();
            })
            .catch(error => console.error('Error fetching trips data:', error));
    }

    function addSaveButtonListeners() {
        document.querySelectorAll('.save-btn').forEach(button => {
            button.addEventListener('click', () => {
                const destinationItem = button.closest('.destination-item');
                const reviewerName = destinationItem.querySelector('.reviewer-name').value.trim();
                const reviewText = destinationItem.querySelector('.review-text').value.trim();
                const rating = destinationItem.querySelector('.rating');
                const selectedStars = rating.querySelectorAll('.star.selected');

                // Validate reviewer name
                const nameRegex = /^[A-Za-zåäöÅÄÖ ]+$/;
                if (!reviewerName || !nameRegex.test(reviewerName)) {
                    alert('Vänligen ange ett giltigt namn som endast innehåller bokstäver.');
                    return;
                }

                // Validate review text
                if (!reviewText) {
                    alert('Vänligen skriv en recension.');
                    return;
                }

                // Validate rating
                if (selectedStars.length === 0) {
                    alert('Vänligen välj minst en stjärna innan du sparar.');
                    return;
                }

                const destinationName = button.getAttribute('data-destination');
                const imageSrc = destinationItem.querySelector('img').src;
                const ratingHTML = rating.innerHTML;

                saveTrip(destinationName, imageSrc, ratingHTML, reviewerName, reviewText);

                const listItem = document.createElement('li');
                listItem.classList.add('trip-item');
                listItem.innerHTML = `
                    <img src="${imageSrc}" alt="${destinationName}">
                    <div class="trip-details">
                        <h3>${destinationName}</h3>
                        <div class="rating">${ratingHTML}</div>
                        <p><strong>Recension av ${reviewerName}:</strong> ${reviewText}</p>
                    </div>
                `;
                savedTripsList.appendChild(listItem);
            });
        });
    }

    function addRatingEventListeners() {
        document.querySelectorAll('.rating .star').forEach(star => {
            star.addEventListener('click', () => {
                const stars = star.parentElement.querySelectorAll('.star');
                const starIndex = Array.from(stars).indexOf(star);

                stars.forEach((s, index) => {
                    s.innerHTML = index <= starIndex ? '&#9733;' : '&#9734;';
                    s.classList.toggle('selected', index <= starIndex);
                });
            });
        });
    }

    function saveTrip(destinationName, imageSrc, rating, reviewerName, reviewText) {
        const savedTrips = JSON.parse(localStorage.getItem('savedTrips')) || [];
        savedTrips.push({ name: destinationName, imageSrc, rating, reviewerName, reviewText });
        localStorage.setItem('savedTrips', JSON.stringify(savedTrips));
    }

    function loadSavedTrips() {
        const savedTrips = JSON.parse(localStorage.getItem('savedTrips')) || [];
        savedTrips.forEach(trip => {
            const listItem = document.createElement('li');
            listItem.classList.add('trip-item');
            listItem.innerHTML = `
                <img src="${trip.imageSrc}" alt="${trip.name}">
                <div class="trip-details">
                    <h3>${trip.name}</h3>
                    <div class="rating">${trip.rating}</div>
                    <p><strong>Recension av ${trip.reviewerName}:</strong> ${trip.reviewText}</p>
                </div>
            `;
            savedTripsList.appendChild(listItem);
        });
    }

    loadSavedTrips();
    fetchTripsData();
});
