document.addEventListener("DOMContentLoaded", function () {
    // Retrieve plan details from localStorage
    const mobileNumber = localStorage.getItem("mobileNumber") || "Not Available";
    const planPrice = localStorage.getItem("planPrice") || "N/A";
    const planData = localStorage.getItem("planData") || "N/A";
    const planValidity = localStorage.getItem("planValidity") || "N/A";
    const planOtt = localStorage.getItem("planOtt") || "None";
    // Check if plan details exist; if not, redirect to plans page
    if (!planPrice || !mobileNumber) {
        alert("No plan selected or mobile number missing. Redirecting to plans page.");
        window.location.href = "/project/User/html/plan.html";
        return;
    }

    // Display plan details in the summary
    document.getElementById("summaryMobile").innerText = `Mobile Number: ${mobileNumber}`;
    document.getElementById("summaryPlan").innerText = `Plan: ₹${planPrice}`;
    document.getElementById("summaryData").innerText = `Data: ${planData} GB`;
    document.getElementById("summaryValidity").innerText = `Validity: ${planValidity} days`;
    document.getElementById("summaryOtt").innerText = `OTT: ${planOtt}`;

    // Back to Plans button event listener
    document.getElementById("backToPlansBtn").addEventListener("click", function() {
        window.location.href = "/project/User/html/plan.html";
    });

    // Pay Now button event listener
    document.getElementById("payNowBtn").addEventListener("click", function () {
        // Determine selected payment method based on expanded accordion
        let paymentMode = "Credit/Debit Card"; // Default
        const cardCollapse = document.querySelector("#collapseCard");
        const netBankingCollapse = document.querySelector("#collapseNetBanking");
        const upiCollapse = document.querySelector("#collapseUPI");

        if (netBankingCollapse && netBankingCollapse.classList.contains("show")) {
            paymentMode = "Net Banking";
        } else if (upiCollapse && upiCollapse.classList.contains("show")) {
            paymentMode = "UPI";
        }

        // Validate payment inputs
        let isValid = true;
        let errorMessage = "";

        if (paymentMode === "Credit/Debit Card") {
            const cardNumber = document.getElementById("cardNumber").value.trim();
            const cvv = document.getElementById("cvv").value.trim();
            if (!cardNumber || cardNumber.length !== 16 || isNaN(cardNumber)) {
                isValid = false;
                errorMessage = "Please enter a valid 16-digit card number.";
            } else if (!cvv || cvv.length !== 3 || isNaN(cvv)) {
                isValid = false;
                errorMessage = "Please enter a valid 3-digit CVV.";
            }
        } else if (paymentMode === "Net Banking") {
            const bankSelect = document.getElementById("bankSelect");
            if (!bankSelect) {
                isValid = false;
                errorMessage = "Please select a bank.";
            }
        } else if (paymentMode === "UPI") {
            const upiId = document.getElementById("upiId").value.trim();
            if (!upiId || !upiId.includes("@")) {
                isValid = false;
                errorMessage = "Please enter a valid UPI ID (e.g., user@upi).";
            }
        }

        // Handle validation failure
        if (!isValid) {
            let errorDiv = document.getElementById("paymentError");
            if (!errorDiv) {
                errorDiv = document.createElement("div");
                errorDiv.id = "paymentError";
                errorDiv.className = "text-danger mt-2";
                document.querySelector(".card.p-3.shadow-sm").appendChild(errorDiv);
            }
            errorDiv.innerText = errorMessage;
            alert("Ivalid");
            return;
        }
        // Clear any previous error messages if validation succeeds
        const errorDiv = document.getElementById("paymentError");
        if (errorDiv) {
            errorDiv.remove();
        }

        // Simulate payment processing
        document.getElementById("payNowBtn").innerText = "Processing...";
        document.getElementById("payNowBtn").disabled = true;

        setTimeout(() => {
            // Generate a mock transaction ID
            const transactionId = "TXN" + Math.floor(Math.random() * 1000000000);
            localStorage.setItem("transactionId", transactionId);
            localStorage.setItem("paymentMode", paymentMode);
            // Redirect to success page
            window.location.href = "/project/User/html/success.html";
        }, 2000); // 2-second delay to simulate processing
    });
});