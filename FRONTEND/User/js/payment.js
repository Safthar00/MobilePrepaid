// Base URL for API requests (adjust as per your backend setup)
const BASE_URL = "http://localhost:8084"; // Replace with your actual backend URL

// Function to initialize Razorpay payment
function initiateRazorpayPayment() {
    // Retrieve logged-in user details from localStorage
    const user = JSON.parse(localStorage.getItem('user')) || {};
    

    // Fetch selected plan details from localStorage
    const selectedPlan = JSON.parse(localStorage.getItem("selectedPlan")) || {};
    const { id: planId, price, name, validity, description } = selectedPlan;

    if (!planId || !price) {
        alert("No plan selected. Please choose a plan first.");
        return;
    }

    // Razorpay options
    const options = {
        key: "rzp_test_1DP5mmOlF5G5ag", // Replace with your Razorpay Key ID
        amount: price * 100, // Amount in paise 
        currency: "INR",
        name: "TelecomX",
        description: description || `Recharge for plan: ${name}`,
        handler: async function (response) {
            console.log("Razorpay response:", response);
            const transId = response.razorpay_payment_id || "TEMP_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);            
            const transactionData = {
                trans_id: transId,
                amount: price,
                validity:validity,
                payment_mode: "RAZORPAY",
                status: "SUCCESS",
                tran_date: new Date().toISOString().split("T")[0],
                user_id: user.userId
            };
            try {
                // Send transaction data to backend
                const saveResponse = await saveTransaction(transactionData);
                const responseData = await saveResponse.json();
                console.log("Transaction save response:", responseData);
                if (saveResponse.ok) {
                    // Redirect to success page on successful save
                    const transactionDetails = {
                        mobileNumber: localStorage.getItem("rechargeMobile") || "Not Available",
                        planDetails: `₹${price}, ${selectedPlan.data || "0"}GB, ${validity} days`,
                        amount: `₹${price}`,
                        paymentMode: "RAZORPAY",
                        transactionId: transId
                    };
                    
                    // Store in sessionStorage
                    sessionStorage.setItem("transactionDetails", JSON.stringify(transactionDetails));
                    // Generate PDF invoice
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            doc.setFontSize(18);
            doc.text("TelecomX Invoice", 20, 20);
            doc.setFontSize(12);
            doc.text(`Transaction ID: ${transId}`, 20, 40);
            doc.text(`Mobile Number: ${transactionDetails.mobileNumber}`, 20, 50);
            doc.text(`Plan: ${transactionDetails.planDetails}`, 20, 60);
            doc.text(`Amount: ${transactionDetails.amount}`, 20, 70);
            doc.text(`Payment Mode: ${transactionDetails.paymentMode}`, 20, 80);
            doc.text(`Date: ${transactionData.tran_date}`, 20, 90);
            const pdfBase64 = doc.output('datauristring').split(',')[1]; 
            console.log("Generated pdfBase64:", pdfBase64);
            // Send PDF to backend for emailing
            const emailResponse = await fetch(`${BASE_URL}/transactions/send-invoice`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: user.userId,
                    pdfBase64: pdfBase64,
                    transactionId: transId
                })
            });
            if (!emailResponse.ok) {
                console.error("Failed to send invoice email:", await emailResponse.text());
                alert("Payment successful, but failed to send invoice email. Please contact support.");
            }
                window.location.href = "../html/success.html";
            } else {
                throw new Error("Failed to save transaction");
            }
            } catch (error) {
                console.error("Error saving transaction:", error);
                alert("Payment was successful, but there was an issue saving the transaction. Please contact support.");
            }
        },
        prefill: {
            name: user.firstName + " " + user.lastName || "",
            email: user.email || "",
            contact: localStorage.getItem("rechargeMobile")?.replace('+91', '') || ""        },
        theme: {
            color: "#002349", 
        },
        modal: {
            ondismiss: function () {
                console.log("Payment modal closed by user");
                setButtonLoading(document.getElementById("payNowBtn"), false);
            },
        },
    };

    // Initialize Razorpay
    const rzp = new Razorpay(options);

    // Open Razorpay checkout
    rzp.open();

    // Handle payment failure
    rzp.on("payment.failed", async function (response) {
        console.error("Payment failed:", response.error);
        const transId = response.error.metadata.payment_id || "FAILED_" + Date.now();
        const transactionData = {
            trans_id: transId,
            amount: price,
            validity:validity,
            payment_mode: "RAZORPAY",
            status: "FAIL",
            tran_date: new Date().toISOString().split("T")[0],
            user: { user_id: user.userId }
        };

        try {
            await saveTransaction(transactionData);
        } catch (error) {
            console.error("Failed to save failed transaction:", error);
        }

        alert(`Payment failed: ${response.error.description}`);
        setButtonLoading(document.getElementById("payNowBtn"), false);
    });
}

// Function to save transaction to backend
async function saveTransaction(transactionData) {
    const response = await fetch(`${BASE_URL}/transactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("jwtToken") || ""}`
         },
        body: JSON.stringify(transactionData),
    });
    console.log("Sending transaction data:", transactionData);

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response;
}

// Utility function to toggle button loading state
function setButtonLoading(button, isLoading) {
    if (isLoading) {
        button.disabled = true;
        button.innerHTML = "Processing...";
    } else {
        button.disabled = false;
        button.innerHTML = "Pay Now";
    }
}

// Event listener for Pay Now button
document.addEventListener("DOMContentLoaded", function () {
    const payNowBtn = document.getElementById("payNowBtn");
    const backToPlansBtn = document.getElementById("backToPlansBtn");

    // Handle Pay Now button click
    payNowBtn.addEventListener("click", function () {
        setButtonLoading(payNowBtn, true);
        initiateRazorpayPayment();
    });

    // Handle Back to Plans button (existing functionality preserved)
    backToPlansBtn.addEventListener("click", function () {
        window.location.href = "../html/plan.html";
    });

    // Populate payment summary (example, adjust as per your actual data structure)
    const selectedPlan = JSON.parse(localStorage.getItem("selectedPlan")) || {};
    document.getElementById("summaryMobile").textContent = `Mobile: ${localStorage.getItem("rechargeMobile") || "N/A"}`;
    document.getElementById("summaryPlan").textContent = `Plan: ${selectedPlan.name || "N/A"}`;
    document.getElementById("summaryData").textContent = `Data: ${selectedPlan.data || "N/A"}`;
    document.getElementById("summaryValidity").textContent = `Validity: ${selectedPlan.validity || "N/A"}`;
    document.getElementById("summaryOtt").textContent = `OTT Benefits: ${selectedPlan.benefits || "None"}`;
});