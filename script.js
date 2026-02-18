document.addEventListener("DOMContentLoaded", function () {
    const searchButton = document.getElementById("search-btn");
    const usernameInput = document.getElementById("username-box");

    const easyCircle = document.querySelector(".easy-progress");
    const mediumCircle = document.querySelector(".medium-progress");
    const hardCircle = document.querySelector(".hard-progress");

    const easyLabel = document.getElementById("easy-label");
    const mediumLabel = document.getElementById("medium-label");
    const hardLabel = document.getElementById("hard-label");

    const totalCard = document.getElementById("total-container");
    const acceptanceCard = document.getElementById("acceptance-value-container");
    const rankCard = document.getElementById("rank-container");
    const contributionCard = document.getElementById("contribution-container");


    const statsContainer = document.querySelector(".stats-container");
    const cardsSection = document.querySelector(".cards-section");

    const input = document.getElementById("username-box");
    const clearBtn = document.getElementById("clear-btn");

    input.addEventListener("input", function () {
        if (input.value.trim().length > 0) {
            clearBtn.classList.add("show");
        } else {
            clearBtn.classList.remove("show");
        }
    });

    clearBtn.addEventListener("click", function () {
        input.value = "";
        clearBtn.classList.remove("show");
        input.focus();
    });


    function validateUsername(username) {
        if (username.trim() === "") {
            alert("Username cannot be empty.");
            return false;
        }
        return true;
    }

    function updateCircle(circle, percent, color) {
        const safePercent = Math.max(percent, 1); // prevent invisible 0%
        circle.style.setProperty("--progress", safePercent);
        circle.style.setProperty("--color", color);
    }

    async function fetchUserDetails(username) {
        const url = `https://leetcode-api-faisalshohag.vercel.app/deepindersinghbti`;

        try {
            searchButton.textContent = "Searching...";
            searchButton.disabled = true;
            searchButton.style.backgroundColor = "grey";

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error("Unable to fetch user details.");
            }

            const data = await response.json();
            console.log("User Data:", data);

            if (data.status === "error") {
                throw new Error("User not found.");
            }

            // Calculate percentages
            const easyPercent = (data.easySolved / data.totalEasy) * 100;
            const mediumPercent = (data.mediumSolved / data.totalMedium) * 100;
            const hardPercent = (data.hardSolved / data.totalHard) * 100;
            statsContainer.classList.remove("hidden");
            cardsSection.classList.remove("hidden");

            const accepted = data.matchedUserStats.acSubmissionNum.find(
                item => item.difficulty === "All"
            ).submissions;

            const total = data.matchedUserStats.totalSubmissionNum.find(
                item => item.difficulty === "All"
            ).submissions;

            const acceptanceRate = ((accepted / total) * 100).toFixed(2);

            // Update circles
            updateCircle(easyCircle, easyPercent, "#22c55e");
            updateCircle(mediumCircle, mediumPercent, "#facc15");
            updateCircle(hardCircle, hardPercent, "#ef4444");

            easyLabel.textContent = `${data.easySolved}/${data.totalEasy}`;
            mediumLabel.textContent = `${data.mediumSolved}/${data.totalMedium}`;
            hardLabel.textContent = `${data.hardSolved}/${data.totalHard}`;

            acceptanceCard.textContent = `${acceptanceRate}` + "%";
            rankCard.textContent = `${data.ranking}`;
            totalCard.textContent = `${data.totalSolved}`;
            contributionCard.textContent = `${data.contributionPoint}`;

        } catch (error) {
            statsContainer.classList.add("hidden");
            cardsSection.classList.add("hidden");
            statsContainer.innerHTML = `<p style="color:#ef4444;text-align:center;margin-top:2rem;font-size:1.1rem;font-weight:500;">No data found.</p>`;
            statsContainer.classList.remove("hidden");
        } finally {
            searchButton.textContent = "Search";
            searchButton.disabled = false;
            searchButton.style.backgroundColor = "#4f46e5";
        }
    }

    searchButton.addEventListener("click", function (e) {
        e.preventDefault();

        const username = usernameInput.value.trim();

        if (validateUsername(username)) {
            fetchUserDetails(username);
        }
    });
});
