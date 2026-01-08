/**
 * Main Application Logic
 * Handles app initialization and global functionality
 */

// ========== Application State ==========

const app = {
    currentUser: null,
    currentPage: null,
    filters: {
        search: '',
        dateFrom: null,
        dateTo: null,
        paymentStatus: 'all'
    },
    
    init() {
        this.detectCurrentPage();
        this.setupGlobalEventListeners();
        this.loadInitialData();
    },
    
    detectCurrentPage() {
        const path = window.location.pathname;
        const page = path.split('/').pop() || 'index.html';
        this.currentPage = page.replace('.html', '');
    },
    
    setupGlobalEventListeners() {
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // ESC to close modals
            if (e.key === 'Escape') {
                document.querySelectorAll('.modal.active').forEach(modal => {
                    modal.classList.remove('active');
                });
            }
            
            // Ctrl/Cmd + K to focus search
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                const searchInput = document.getElementById('searchInput');
                if (searchInput) {
                    searchInput.focus();
                }
            }
            
            // Ctrl/Cmd + P to print (on reports page)
            if ((e.ctrlKey || e.metaKey) && e.key === 'p' && this.currentPage === 'reports') {
                e.preventDefault();
                window.print();
            }
        });
        
        // Handle online/offline status
        window.addEventListener('online', () => {
            showNotification('تم الاتصال بالإنترنت', 'success');
        });
        
        window.addEventListener('offline', () => {
            showNotification('انقطع الاتصال بالإنترنت', 'warning');
        });
        
        // Prevent accidental page reload with unsaved changes
        window.addEventListener('beforeunload', (e) => {
            const modals = document.querySelectorAll('.modal.active');
            if (modals.length > 0) {
                e.preventDefault();
                e.returnValue = '';
            }
        });
    },
    
    loadInitialData() {
        // Load any initial data required for the current page
        switch (this.currentPage) {
            case 'index':
                this.loadDashboardData();
                break;
            case 'lawyers':
                this.loadLawyersData();
                break;
            case 'transactions':
                this.loadTransactionsData();
                break;
            case 'reports':
                this.loadReportsData();
                break;
        }
    },
    
    loadDashboardData() {
        // Dashboard-specific initialization
        console.log('Dashboard loaded');
    },
    
    loadLawyersData() {
        // Lawyers page-specific initialization
        console.log('Lawyers page loaded');
    },
    
    loadTransactionsData() {
        // Transactions page-specific initialization
        console.log('Transactions page loaded');
    },
    
    loadReportsData() {
        // Reports page-specific initialization
        console.log('Reports page loaded');
    }
};

// ========== Data Export/Import Functions ==========

function exportDataToJSON() {
    const data = storage.exportData();
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `ltms_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    showNotification('تم تصدير البيانات بنجاح', 'success');
}

function importDataFromJSON(file) {
    const reader = new FileReader();
    
    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result);
            
            if (confirmAction('هل أنت متأكد من استيراد هذه البيانات؟ سيتم استبدال البيانات الحالية.')) {
                storage.importData(data);
                showNotification('تم استيراد البيانات بنجاح', 'success');
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            }
        } catch (error) {
            showNotification('فشل استيراد البيانات. تأكد من صحة الملف.', 'error');
            console.error('Import error:', error);
        }
    };
    
    reader.readAsText(file);
}

function clearAllData() {
    if (confirmAction('هل أنت متأكد من حذف جميع البيانات؟ هذا الإجراء لا يمكن التراجع عنه.')) {
        if (confirmAction('تأكيد نهائي: سيتم حذف جميع المحامين والمعاملات. هل تريد المتابعة؟')) {
            storage.clearAllData();
            storage.init(); // Reinitialize with sample data
            showNotification('تم حذف جميع البيانات', 'success');
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        }
    }
}

// ========== Search & Filter Functions ==========

function applyFilters(data, filters) {
    let filtered = [...data];
    
    // Search filter
    if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        filtered = filtered.filter(item => {
            return Object.values(item).some(value => 
                String(value).toLowerCase().includes(searchTerm)
            );
        });
    }
    
    // Date range filter
    if (filters.dateFrom) {
        filtered = filtered.filter(item => 
            new Date(item.date) >= new Date(filters.dateFrom)
        );
    }
    
    if (filters.dateTo) {
        filtered = filtered.filter(item => 
            new Date(item.date) <= new Date(filters.dateTo)
        );
    }
    
    // Payment status filter
    if (filters.paymentStatus !== 'all') {
        const isPaid = filters.paymentStatus === 'paid';
        filtered = filtered.filter(item => item.isPaid === isPaid);
    }
    
    return filtered;
}

// ========== Utility Functions ==========

function generateId() {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

function getCurrentDate() {
    return new Date().toISOString().split('T')[0];
}

function getMonthStart(date = new Date()) {
    return new Date(date.getFullYear(), date.getMonth(), 1).toISOString().split('T')[0];
}

function getMonthEnd(date = new Date()) {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).toISOString().split('T')[0];
}

function getLastMonthStart() {
    const date = new Date();
    return new Date(date.getFullYear(), date.getMonth() - 1, 1).toISOString().split('T')[0];
}

function getLastMonthEnd() {
    const date = new Date();
    return new Date(date.getFullYear(), date.getMonth(), 0).toISOString().split('T')[0];
}

// ========== Validation Functions ==========

function validateLawyer(lawyer) {
    if (!lawyer.name || lawyer.name.trim() === '') {
        showNotification('يرجى إدخال اسم المحامي', 'error');
        return false;
    }
    
    if (!lawyer.professionalId || lawyer.professionalId.trim() === '') {
        showNotification('يرجى إدخال رقم الهوية المهنية', 'error');
        return false;
    }
    
    if (!lawyer.phone || lawyer.phone.trim() === '') {
        showNotification('يرجى إدخال رقم الهاتف', 'error');
        return false;
    }
    
    // Phone number validation (Saudi format)
    const phoneRegex = /^(05|5)[0-9]{8}$/;
    if (!phoneRegex.test(lawyer.phone.replace(/\s/g, ''))) {
        showNotification('رقم الهاتف غير صحيح. يجب أن يبدأ بـ 05 ويتكون من 10 أرقام', 'error');
        return false;
    }
    
    return true;
}

function validateTransaction(transaction) {
    if (!transaction.lawyerId) {
        showNotification('يرجى اختيار المحامي', 'error');
        return false;
    }
    
    if (!transaction.documentCount || transaction.documentCount <= 0) {
        showNotification('يرجى إدخال عدد المستندات', 'error');
        return false;
    }
    
    if (!transaction.date) {
        showNotification('يرجى اختيار التاريخ', 'error');
        return false;
    }
    
    if (!transaction.amount || transaction.amount <= 0) {
        showNotification('يرجى إدخال المبلغ', 'error');
        return false;
    }
    
    return true;
}

// ========== Statistics Calculation ==========

function calculateMonthlyStats(transactions) {
    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
    
    const thisMonth = transactions.filter(t => new Date(t.date) >= thisMonthStart);
    const lastMonth = transactions.filter(t => 
        new Date(t.date) >= lastMonthStart && new Date(t.date) <= lastMonthEnd
    );
    
    return {
        thisMonth: {
            count: thisMonth.length,
            amount: thisMonth.reduce((sum, t) => sum + parseFloat(t.amount), 0),
            paid: thisMonth.filter(t => t.isPaid).length,
            unpaid: thisMonth.filter(t => !t.isPaid).length
        },
        lastMonth: {
            count: lastMonth.length,
            amount: lastMonth.reduce((sum, t) => sum + parseFloat(t.amount), 0),
            paid: lastMonth.filter(t => t.isPaid).length,
            unpaid: lastMonth.filter(t => !t.isPaid).length
        }
    };
}

function calculateLawyerRanking(transactions, lawyers) {
    const ranking = lawyers.map(lawyer => {
        const lawyerTransactions = transactions.filter(t => t.lawyerId === lawyer.id);
        const totalAmount = lawyerTransactions.reduce((sum, t) => sum + parseFloat(t.amount), 0);
        const paidAmount = lawyerTransactions
            .filter(t => t.isPaid)
            .reduce((sum, t) => sum + parseFloat(t.amount), 0);
        const unpaidAmount = totalAmount - paidAmount;
        
        return {
            lawyer,
            transactionCount: lawyerTransactions.length,
            totalAmount,
            paidAmount,
            unpaidAmount,
            paidPercentage: totalAmount > 0 ? (paidAmount / totalAmount) * 100 : 0
        };
    });
    
    return ranking.sort((a, b) => b.totalAmount - a.totalAmount);
}

// ========== Performance Monitoring ==========

function measurePerformance(name, fn) {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    console.log(`${name} took ${(end - start).toFixed(2)}ms`);
    return result;
}

// ========== Error Handling ==========

window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
    showNotification('حدث خطأ غير متوقع', 'error');
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
    showNotification('حدث خطأ في معالجة البيانات', 'error');
});

// ========== Initialize Application ==========

document.addEventListener('DOMContentLoaded', () => {
    app.init();
    
    // Log app version and info
    console.log('%cLTMS - Lawyer Transactions Management System', 'color: #3b82f6; font-size: 16px; font-weight: bold;');
    console.log('%cVersion: 1.0.0', 'color: #6c757d;');
    console.log('%cDeveloped with ❤️', 'color: #10b981;');
    
    // Check for updates periodically (every 5 minutes)
    setInterval(() => {
        // Refresh statistics if on dashboard
        if (app.currentPage === 'index' && typeof updateDashboardStats === 'function') {
            updateDashboardStats();
        }
    }, 300000);
});

// ========== Service Worker Registration (Optional - for PWA) ==========

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment to enable service worker
        // navigator.serviceWorker.register('/sw.js')
        //     .then(registration => console.log('SW registered:', registration))
        //     .catch(error => console.log('SW registration failed:', error));
    });
}