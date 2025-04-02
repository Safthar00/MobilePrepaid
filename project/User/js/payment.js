const BASE_URL = 'http://localhost:8084';

document.addEventListener("DOMContentLoaded", function () {
    // Check if Razorpay is loaded
    if (typeof Razorpay === 'undefined') {
        console.error('Razorpay not available');
        const payBtn = document.getElementById("payNowBtn");
        payBtn.disabled = true;
        payBtn.textContent = 'Payment Service Unavailable';
        payBtn.classList.add('btn-danger');
        return;
    }

    // Retrieve plan details
    const selectedPlan = JSON.parse(localStorage.getItem("selectedPlan"));
    const mobileNumber = localStorage.getItem("rechargeMobile") || "Not Available";
    const user = JSON.parse(localStorage.getItem('user')) || {}; // Make user optional
    
    // Validate data
    if (!selectedPlan || !mobileNumber) {
        alert("No plan selected or mobile number missing. Redirecting to plans page.");
        window.location.href = "/project/User/html/plan.html";
        return;
    }

    // Display plan details
    document.getElementById("summaryMobile").innerText = `Mobile Number: ${mobileNumber}`;
    document.getElementById("summaryPlan").innerText = `Plan: ₹${selectedPlan.price}`;
    document.getElementById("summaryData").innerText = `Data: ${selectedPlan.data}`;
    document.getElementById("summaryValidity").innerText = `Validity: ${selectedPlan.validity}`;
    document.getElementById("summaryOtt").innerText = `Benefits: ${selectedPlan.benefits || "None"}`;

    // Back to Plans button
    document.getElementById("backToPlansBtn").addEventListener("click", function() {
        window.location.href = "/project/User/html/plan.html";
    });

    // Pay Now button - Direct Razorpay integration
    document.getElementById("payNowBtn").addEventListener("click", async function () {
        // Store all required data in localStorage for success page
        localStorage.setItem("mobileNumber", mobileNumber);
        localStorage.setItem("planPrice", selectedPlan.price);
        localStorage.setItem("planData", selectedPlan.data);
        localStorage.setItem("planValidity", selectedPlan.validity);
        localStorage.setItem("planOtt", selectedPlan.benefits || "None");
        localStorage.setItem("paymentMode", "Razorpay");

        const payBtn = this;
        payBtn.disabled = true;
        payBtn.textContent = 'Processing...';

        try {
            // Razorpay options
            const options = {
                key: "rzp_test_1DP5mmOlF5G5ag", // Your Razorpay test key
                amount: selectedPlan.price * 100, // Amount in paise
                currency: "INR",
                name: "TelecomX Recharge",
                description: `Recharge for ${mobileNumber}`,
                image: "/project/User/assets/logo.png", // Local logo path
                handler: function (response) {
                    // On successful payment
                    localStorage.setItem("transactionId", response.razorpay_payment_id);
                    window.location.href = "/project/User/html/success.html";
                },
                prefill: {
                    name: user.name || "Customer",
                    email: user.email || "customer@example.com",
                    contact: mobileNumber
                },
                theme: {
                    color: "#002349"
                },
                modal: {
                    ondismiss: function() {
                        payBtn.disabled = false;
                        payBtn.textContent = 'Pay Now';
                    }
                }
            };

            const rzp = new Razorpay(options);
            rzp.on('payment.failed', function(response) {
                console.error('Payment failed:', response.error);
                alert(`Payment failed: ${response.error.description}`);
                payBtn.disabled = false;
                payBtn.textContent = 'Try Again';
            });
            rzp.open();
        } catch (error) {
            console.error('Payment initialization error:', error);
            alert('Payment initialization failed: ' + error.message);
            payBtn.disabled = false;
            payBtn.textContent = 'Pay Now';
        }
    });
});