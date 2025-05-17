// Ticket User Overview 
export function userTickets(tickets, ticketRepliesById, username = null, avatarUrl, isAdmin, GeneralConfig, indexConfig, AuthConfig) {
    const isLoggedIn = username && avatarUrl;

    function formatRelative(dateStr) {
        const now = new Date();
        const past = new Date(dateStr);
        const days = Math.floor((now - past) / (1000 * 60 * 60 * 24));
        if (days === 0) return 'Today';
        if (days === 1) return '1 day ago';
        return `${days} days ago`;
    }

    function escapeHtml(str) {
        if (typeof str !== 'string') return '';
        return str.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }


    // Edit ticket function
    function editTicket(ticketId, description) {
        console.log('Edit Ticket:', ticketId, description);
        // You can implement redirect or form opening logic
        window.location.href = `/user/edit-ticket/${ticketId}`;
    }

    // Reply ticket function
    function replyTicket(ticketId, description) {
        console.log('Reply to Ticket:', ticketId, description);
        // Implement reply functionality such as opening a modal or redirecting
        openReplyModal(ticketId, description);
    }

    function openReplyModal(ticketId, description) {
        // Example modal logic or redirection
        alert(`Replying to Ticket #${ticketId} with description: ${description}`);
    }
    return `
<!DOCTYPE html>
    <!-- © ${GeneralConfig.brand.name}-->
    <!-- Made by ${GeneralConfig.brand.author}-->
    <html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
        <meta http-equiv="Copyright" content="${GeneralConfig.brand.name}"/>

        <!-- Meta Tags -->
        <meta name="author" content="${GeneralConfig.brand.author}"/>
        <meta name="rating" content="general" />
        <meta name="language" content="English" />
        <meta name="application-name" content="${GeneralConfig.title}" />
        
        <!-- Social Media -->
        <meta name="twitter:title" content="Ticket Overview | ${GeneralConfig.title}" />
        <meta name="twitter:description" content="${GeneralConfig.description}" />
        <meta name="twitter:image" content="${GeneralConfig.brand.favicon}" />

        <meta property="og:title" content="Ticket Overview | ${GeneralConfig.title}" />
        <meta property="og:site_name" content="Ticket Overview | ${GeneralConfig.title}" />
        <meta property="og:description" content="${GeneralConfig.description}" />
        <meta property="og:image" content="${GeneralConfig.brand.banner}" />
        <meta property="og:url" content="${GeneralConfig.brand.url}" />
        <meta property="og:type" content="website"  />

        <!-- Page title -->
        <title>Ticket Overview | ${GeneralConfig.title}</title>

        <!-- Description -->
        <meta name="description" content="${GeneralConfig.description}"/>
        
        <!-- Favicons -->
        <link rel="icon" href="${GeneralConfig.brand.favicon}" type="image/png" />
        <link rel="apple-touch-icon" href="${GeneralConfig.brand.favicon}" type="image/png" sizes="16x16" />
        
        <!-- Keywords -->
        <meta name="keywords" content="${GeneralConfig.brand.keywords}"/>
        
        <!-- CSS Plugins -->
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/glightbox/dist/css/glightbox.min.css" />
        <link rel="stylesheet" href="https://cdn.lineicons.com/4.0/lineicons.css" />
        <script src="https://cdn.tailwindcss.com"></script>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">

        <style>
            /* Animation when menu open */≤
                .menu-open span:nth-child(1) {
                    transform: rotate(45deg) translate(5px, 5px);
                }
                .menu-open span:nth-child(2) {
                    opacity: 0;
                }
                .menu-open span:nth-child(3) {
                    transform: rotate(-45deg) translate(5px, -5px);
                }
        </style>
        <script>
        function replyToTicket(ticketId) {
            window.location.href = "/home/tickets/reply/" + ticketId;
        }
    </script>

    </head>
    <body class="bg-[${GeneralConfig.brand.colors.backgroundColor}] text-[${GeneralConfig.brand.colors.textColor}]  font-sans">
    

    <!-- Navigation -->
    <nav class="bg-black/10 backdrop-blur-lg border-b border-white/20 fixed w-full z-50">
        <div class="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <a href="/" class="text-2xl font-bold">Portal | Next Code Two</a>
            

            <!-- Mobile Menu Button -->
            <button id="menu-btn" class="relative w-8 h-8 md:hidden text-black  focus:outline-none">
                <!-- Hamburger Icon -->
                    <svg id="hamburger-icon" class="absolute inset-0 w-8 h-8 transition-all duration-300 ease-in-out" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
                    </svg>

                <!-- X Icon -->
                    <svg id="close-icon" class="absolute inset-0 w-8 h-8 opacity-0 scale-75 transition-all duration-300 ease-in-out" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
            </button>
            <!-- Desktop Menu -->
            <div class="hidden md:flex items-center space-x-8 absolute left-1/2 transform -translate-x-1/2">
                <a href="/" class="relative group text-indigo-400">
                    <span class="transition">Home</span>
                    <span class="absolute left-0 -bottom-0.5 w-full h-0.5 bg-indigo-400"></span>
                </a>    
                ${isLoggedIn ? `
                    <div class="relative">
                        <button id="menu-button" onclick="toggleDropdown()" class="dropbtn group tb-10">
                            <span class="transition">Client Dashboard</span>
                            <span class="absolute left-1/2 -bottom-0.5 w-0 h-0.5 bg-indigo-400 transition-all duration-300 group-hover:w-full group-hover:left-0"></span>
                            <i class="fa fa-caret-down"></i>
                        </button>
                        <div id="dropdownMenu" class="absolute hidden bg-white min-w-[250px] shadow-lg z-10">
                            <a href="/home/tickets" class="block px-4 py-3 text-black hover:text-indigo-400">Tickets</a>
                            <a href="/home/tickets/add" class="block px-4 py-3 text-black hover:text-indigo-400">New Ticket</a>
                        </div>
                    </div>
                ` : ` <a href="/home" class="relative group ">
                    <span class="transition">Dashboard</span>
                     <span class="absolute left-1/2 -bottom-0.5 w-0 h-0.5 bg-indigo-400 transition-all duration-300 group-hover:w-full group-hover:left-0"></span>
                </a>`}
                <a href="/contact" class="relative group">
                    <span class="transition">Contact</span>
                    <span class="absolute left-1/2 -bottom-0.5 w-0 h-0.5 bg-indigo-400 transition-all duration-300 group-hover:w-full group-hover:left-0"></span>
                </a>
                <a href="/faq" class="relative group">
                    <span class="transition">FAQ</span>
                    <span class="absolute left-1/2 -bottom-0.5 w-0 h-0.5 bg-indigo-400 transition-all duration-300 group-hover:w-full group-hover:left-0"></span>
                </a>
                    <div class="relative">
                        <button onclick="toggleDropdownOther()" id="menu-button-other" class="dropbtnOther group  tb-10">
                            <span class="transition">Other</span>
                            <span class="absolute left-1/2 -bottom-0.5 w-0 h-0.5 bg-indigo-400 transition-all duration-300 group-hover:w-full group-hover:left-0"></span>
                            <i class="fa fa-caret-down"></i>
                        </button>
                        <div id="dropdownMenuOther" class="absolute hidden bg-white min-w-[250px] shadow-lg z-10">
                          <a href="/contact" class="block px-4 py-3 text-black hover:text-indigo-400 group">Contact</a>
                          <span class="absolute left-1/2 -bottom-0.5 w-0 h-0.5 bg-indigo-400 transition-all duration-300 group-hover:w-full group-hover:left-0"></span>
                          <a href="/annoucements" class="block px-4 py-3 text-black hover:text-indigo-400">Annoucements</a>
                          <a href="/privacy" class="block px-4 py-3 text-black hover:text-indigo-400">Privacy</a>
                          <a href="/terms" class="block px-4 py-3 text-black hover:text-indigo-400">Terms Of Service</a>
                        </div>
                    </div>
            </div>


        <!-- Mobile Menu -->
        <div id="menu" class="hidden md:hidden px-4 pb-4">
            <a href="/" class="block py-2 text-indigo-400">Home</a>
            ${isLoggedIn ? `
                ${isAdmin ? `<a href="/admin" class="block py-2 hover:text-indigo-400">Dashboard</a>
                <a href="/admin/tickets" class="block py-2 hover:text-indigo-400">Tickets</a>
                <a href="/admin/tickets/add" class="block py-2 hover:text-indigo-400">New Ticket</a>
                ` : `
                <a href="/home" class="block py-2 hover:text-indigo-400">Dashboard</a>
                <a href="/home/tickets" class="block py-2 hover:text-indigo-400">Tickets</a>
                <a href="/home/tickets/add" class="block py-2 hover:text-indigo-400">New Ticket</a>`}
                
                
                ` : `
                <a href="/home" class="block py-2 hover:text-indigo-400">Dashboard</a>
                `}
                <a href="/contact" class="block py-2 hover:text-indigo-400">Contact</a>
                ${isLoggedIn ? `
                    
                    ` : `
                    <a href="/login" class="block w-full mt-2 px-4 py-2 border border-indigo-400 rounded-full text-center hover:bg-indigo-400 hover:text-white transition duration-500 ">Login / Register</a>`}
        </div>
    </nav>
    <!-- End Navigation -->
 <!-- Main Content Area -->
    <main class="pt-20">

        <!-- Hero Section -->
        <section class="bg-gradient-to-b from-white to-gray-100 py-20 px-4">
            <div class="container mx-auto text-center">
                <h1 class="text-4xl md:text-5xl font-bold mb-4 text-indigo-500 ">Your Tickets</h1>
                <p class="text-lg md:text-xl text-gray-700  max-w-3xl mx-auto">
                   Here you can view all your submitted tickets, track their status, and stay updated with responses from our support team. We're here to help—every step of the way.
                </p>
            </div>
        </section>



   <div class="max-w-6xl mx-auto p-6 text-gray-200">
      <!-- Tabs -->
      <div class="flex flex-col md:flex-row justify-between items-center mb-6 bg-[#1e2235] p-4 rounded-xl shadow">
        <div class="flex space-x-6 text-sm font-medium">
          <span class="text-white border-b-2 border-blue-500 pb-1">All Tickets (${tickets.length})</span>
          <span class="text-gray-400">Closed (${tickets.filter(t => t.status === 'closed').length})</span>
        </div>
        <div class="flex items-center mt-4 md:mt-0 space-x-4">
          <a href="/home/tickets/add" class="bg-[#2a2f4a] text-white px-4 py-2 rounded-md hover:bg-blue-600 transition">+ New Ticket</a>
        </div>
      </div>

      <!-- Tickets -->
      <div class="space-y-6">
        ${tickets.map(ticket => {
        const replies = ticketRepliesById[ticket.id] || [];
        const lastReply = replies[replies.length - 1];
        const lastSender = lastReply?.username || username;
        const lastMessage = lastReply?.message || ticket.subject;

        let statusColor = 'bg-gray-600'; // default color for closed
        if (ticket.status === 'open') {
            statusColor = 'bg-green-600'; // open status is green
        }
        return `
            <div class="bg-gray-200  p-6 rounded-xl shadow-md">
              <div class="flex justify-between">
                <div>
                  <p class="text-sm text-gray-400">Ticket #${ticket.id}</p>
                  <h2 class="text-lg text-black "><strong>Subject:</strong> ${ticket.title}</h2>
                  <p class="text-lg text-black "><strong> Description:</strong> ${ticket.description} <p>
                  <p class="mt-2 text-sm">
                    <span class="text-gray-400">Last Message:</span>
                    <strong class="text-black ">${lastSender}:</strong>
                    <span class="text-black "> ${escapeHtml(lastMessage)}</span>
                  </p>
                  <div class="flex items-center mt-3 space-x-2">
                    <img src="${avatarUrl}" class="w-8 h-8 rounded-full border border-gray-500" alt="avatar">
                    <span class="text-sm text-black ">${lastSender}</span>
                  </div>
                </div>
                <div class="text-right space-y-2">
                  <span class="text-sm text-gray-400">Last Updated: ${formatRelative(ticket.created_at)}</span>
                  <div class="flex justify-end items-center space-x-3 mt-1">
                    <div class="flex justify-end space-x-3 mt-2">
                        <button onclick="replyToTicket('${ticket.id}')" class="px-3 py-1 bg-blue-500 rounded hover:bg-blue-600 text-sm">Reply</button>
                    </div>
                    <div class="mt-4 flex justify-end">
                        <span class="text-xs px-3 py-1 rounded-full ${statusColor} text-white">${ticket.status}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          `;
    }).join('')}
      </div>
    </div>

  <!-- Footer -->
    <footer class="bg-gray-900 py-6 mt-12">
        <div class="max-w-7xl mx-auto text-center text-white">
            <p>&copy; 2025 Next Code Two. All rights reserved.</p>
        </div>
    </footer>
    <script>
    const menuBtn = document.getElementById('menu-btn');
    const menu = document.getElementById('menu');
    const hamburgerIcon = document.getElementById('hamburger-icon');
    const closeIcon = document.getElementById('close-icon');

    menuBtn.addEventListener('click', () => {
      menu.classList.toggle('hidden');

      if (menu.classList.contains('hidden')) {
        // Show hamburger, hide X
        hamburgerIcon.classList.remove('opacity-0', 'scale-75');
        closeIcon.classList.add('opacity-0', 'scale-75');
      } else {
        // Show X, hide hamburger
        hamburgerIcon.classList.add('opacity-0', 'scale-75');
        closeIcon.classList.remove('opacity-0', 'scale-75');
      }
    });

     function toggleDropdown() {
      const menu = document.getElementById('dropdownMenu');
      menu.classList.toggle('hidden');
    }

    function toggleDropdownOther() {
      const menu = document.getElementById('dropdownMenuOther');
      menu.classList.toggle('hidden');
    }
    
    
    </script>

</body>
</html>
`;
}
