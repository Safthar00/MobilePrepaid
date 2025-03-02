document.addEventListener("DOMContentLoaded", function() {
    //Element References
    // Navigation elements
    const sidebarToggle = document.getElementById("sidebarToggle");
    const sidebar = document.getElementById("sidebar");
    const mainContent = document.querySelector(".main-content");
    
    // Notification elements
    const notificationBtn = document.getElementById("notificationBtn");
    const notificationPanel = document.getElementById("notificationPanel");
    const closeNotificationBtn = document.getElementById("closeNotificationBtn");
    const notificationBadge = document.querySelector(".notification-badge");
    
    // Modal elements
    const rechargeModal = new bootstrap.Modal(document.getElementById("rechargeModal"));
    const rechargeSuccessModal = new bootstrap.Modal(document.getElementById("rechargeSuccessModal"));
    const proceedRechargeBtn = document.getElementById("proceedRechargeBtn");
    const successAmount = document.getElementById("successAmount");
    const transactionId = document.getElementById("transactionId");
    
    // Scroll elements
    const scrollToTopBtn = document.getElementById("scrollToTopBtn");
    
    // Navigation links for smooth scrolling
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    //Sidebar Functionality
    function toggleSidebar() {
        sidebar.classList.toggle("show");
        
        if (window.innerWidth > 991.98) {
            mainContent.style.marginLeft = sidebar.classList.contains("show") ? "250px" : "0";
        }
    }
    
    // Initialize sidebar state based on screen size
    function initializeSidebar() {
        if (window.innerWidth <= 991.98) {
            sidebar.classList.remove("show");
            mainContent.style.marginLeft = "0";
        } else {
            sidebar.classList.add("show");
            mainContent.style.marginLeft = "250px";
        }
    }
    
    //Notification Panel Functionality
    function toggleNotificationPanel(e) {
        if (e) e.preventDefault();
        notificationPanel.classList.toggle("show");
    }
    
    function closeNotificationPanel() {
        notificationPanel.classList.remove("show");
    }
    
    function updateNotificationBadge(increment = true) {
        let currentCount = parseInt(notificationBadge.textContent);
        notificationBadge.textContent = increment ? currentCount + 1 : currentCount - 1;
    }
    
    function addNotification(title, description, time = "Just now") {
        const notificationList = document.querySelector(".notification-list");
        const newNotification = document.createElement("div");
        newNotification.className = "notification-item unread";
        newNotification.innerHTML = `
            <div class="notification-title">${title}</div>
            <div class="notification-description">${description}</div>
            <div class="notification-time">${time}</div>
        `;
        
        // Add click listener to mark as read
        newNotification.addEventListener("click", function() {
            if (this.classList.contains("unread")) {
                this.classList.remove("unread");
                updateNotificationBadge(false);
            }
        });
        
        notificationList.prepend(newNotification);
        updateNotificationBadge();
    }
    
    //Recharge Functionality 
    function processRecharge() {
        const amount = document.getElementById("rechargeAmount").value;
        const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').id;
        
        // Update success modal
        successAmount.textContent = "₹" + amount;
        transactionId.textContent = "TCN" + Math.floor(Math.random() * 1000000000);
        
        // Close recharge modal and show success modal
        rechargeModal.hide();
        setTimeout(() => {
            rechargeSuccessModal.show();
            
            // Add notification
            addNotification(
                "Recharge Successful",
                `Your recharge of ₹${amount} was successful. Enjoy your services!`
            );
            
            // Update current plan details (simulation)
            updatePlanDetails(amount);
        }, 300);
    }
    
    function updatePlanDetails(amount) {
        // Simulate updating plan details based on recharge amount
        // In a real application, this would come from the server
        const planDetails = {
            "199": { data: "2GB/day", validity: "28 days", ott: "Hotstar" },
            "399": { data: "3GB/day", validity: "56 days", ott: "Netflix" },
            "599": { data: "1.5GB/day", validity: "84 days", ott: "Amazon Prime" },
            "799": { data: "2.5GB/day", validity: "365 days", ott: "Sony Live" }
        };
        
        if (planDetails[amount]) {
            // Update transaction history
            addTransactionRecord(amount);
        }
    }
    
    function addTransactionRecord(amount) {
        // Add transaction to the history table
        const transactionTable = document.querySelector("#transactions tbody");
        const newRow = document.createElement("tr");
        
        const today = new Date();
        const formattedDate = `${today.getDate()} ${today.toLocaleString('default', { month: 'short' })}, ${today.getFullYear()}`;
        
        newRow.innerHTML = `
            <td>${formattedDate}</td>
            <td>${transactionId.textContent}</td>
            <td>₹${amount}</td>
            <td>Recharge</td>
            <td><span class="badge bg-success">Success</span></td>
        `;
        
        transactionTable.prepend(newRow);
    }
    
    //Scroll Functionality
    function toggleScrollToTopButton() {
        if (window.scrollY > 300) {
            scrollToTopBtn.style.display = "block";
        } else {
            scrollToTopBtn.style.display = "none";
        }
    }
    
    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }
    
    function handleSmoothScroll(e) {
        e.preventDefault();
        const targetId = this.getAttribute("href");
        if (targetId === "#") return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            // Close sidebar on mobile when navigating
            if (window.innerWidth <= 991.98) {
                sidebar.classList.remove("show");
            }
            
            const headerOffset = 70; // Account for fixed header
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
        }
    }
    
    //Initialize Event Listeners
    function initEventListeners() {
        // Sidebar events
        sidebarToggle.addEventListener("click", toggleSidebar);
        
        // Notification events
        notificationBtn.addEventListener("click", toggleNotificationPanel);
        closeNotificationBtn.addEventListener("click", closeNotificationPanel);
        
        // Mark notifications as read when clicked
        document.querySelectorAll(".notification-item").forEach(item => {
            item.addEventListener("click", function() {
                if (this.classList.contains("unread")) {
                    this.classList.remove("unread");
                    updateNotificationBadge(false);
                }
            });
        });
        
        // Recharge events
        proceedRechargeBtn.addEventListener("click", processRecharge);
        
        // Scroll events
        window.addEventListener("scroll", toggleScrollToTopButton);
        scrollToTopBtn.addEventListener("click", scrollToTop);
        
        // Smooth scrolling for navigation links
        navLinks.forEach(link => {
            link.addEventListener("click", handleSmoothScroll);
        });
        
        // Window resize event
        window.addEventListener("resize", initializeSidebar);
        
        // Close notification panel when clicking outside
        document.addEventListener("click", function(e) {
            if (notificationPanel.classList.contains("show") && 
                !notificationPanel.contains(e.target) && 
                e.target !== notificationBtn) {
                closeNotificationPanel();
            }
        });
    }
    
    //Public Functions
    // Recharge Now function for recommended plans
    window.rechargeNow = function(amount, data, validity, ott) {
        successAmount.textContent = "₹" + amount;
        transactionId.textContent = "TXN" + Math.floor(Math.random() * 1000000000);
        
        setTimeout(() => {
            rechargeSuccessModal.show();
            
            // Add notification
            addNotification(
                "Recharge Successful",
                `Your recharge of ₹${amount} was successful. Enjoy your services!`
            );
            
            // Update transaction history
            addTransactionRecord(amount);
        }, 300);
    };
    
    //Initialize Application
    function initApp() {
        initializeSidebar();
        initEventListeners();
        toggleScrollToTopButton(); // Check initial scroll position
    }
    
    // Initialize the application
    initApp();


});