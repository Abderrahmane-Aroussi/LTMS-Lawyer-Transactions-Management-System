/**
 * Storage Module - Manages all localStorage operations
 * Handles lawyers, transactions data with persistence
 */

const storage = {
    // Storage keys
    KEYS: {
        LAWYERS: 'ltms_lawyers',
        TRANSACTIONS: 'ltms_transactions',
        THEME: 'ltms_theme'
    },

    // Initialize storage with sample data if empty
    init() {
        if (!this.getLawyers().length) {
            this.initSampleData();
        }
    },

    // Initialize sample data for demonstration
    initSampleData() {
        const sampleLawyers = [
            {
                id: '1',
                name: 'أحمد محمد العلي',
                professionalId: 'LAW-2024-001',
                phone: '0501234567'
            },
            {
                id: '2',
                name: 'فاطمة خالد السالم',
                professionalId: 'LAW-2024-002',
                phone: '0507654321'
            },
            {
                id: '3',
                name: 'محمد عبدالله الحربي',
                professionalId: 'LAW-2024-003',
                phone: '0509876543'
            }
        ];

        const sampleTransactions = [
            {
                id: '1',
                lawyerId: '1',
                documentCount: 5,
                date: new Date(2025, 0, 5).toISOString().split('T')[0],
                amount: 2500,
                isPaid: true
            },
            {
                id: '2',
                lawyerId: '1',
                documentCount: 3,
                date: new Date(2025, 0, 7).toISOString().split('T')[0],
                amount: 1500,
                isPaid: false
            },
            {
                id: '3',
                lawyerId: '2',
                documentCount: 8,
                date: new Date(2025, 0, 6).toISOString().split('T')[0],
                amount: 4000,
                isPaid: true
            },
            {
                id: '4',
                lawyerId: '2',
                documentCount: 2,
                date: new Date(2025, 0, 8).toISOString().split('T')[0],
                amount: 1000,
                isPaid: false
            },
            {
                id: '5',
                lawyerId: '3',
                documentCount: 10,
                date: new Date(2024, 11, 20).toISOString().split('T')[0],
                amount: 5000,
                isPaid: true
            }
        ];

        localStorage.setItem(this.KEYS.LAWYERS, JSON.stringify(sampleLawyers));
        localStorage.setItem(this.KEYS.TRANSACTIONS, JSON.stringify(sampleTransactions));
    },

    // ========== Lawyers CRUD Operations ==========
    
    getLawyers() {
        try {
            const data = localStorage.getItem(this.KEYS.LAWYERS);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error getting lawyers:', error);
            return [];
        }
    },

    getLawyer(id) {
        return this.getLawyers().find(lawyer => lawyer.id === id);
    },

    addLawyer(lawyer) {
        try {
            const lawyers = this.getLawyers();
            lawyers.push(lawyer);
            localStorage.setItem(this.KEYS.LAWYERS, JSON.stringify(lawyers));
            return true;
        } catch (error) {
            console.error('Error adding lawyer:', error);
            return false;
        }
    },

    updateLawyer(updatedLawyer) {
        try {
            const lawyers = this.getLawyers();
            const index = lawyers.findIndex(l => l.id === updatedLawyer.id);
            if (index !== -1) {
                lawyers[index] = updatedLawyer;
                localStorage.setItem(this.KEYS.LAWYERS, JSON.stringify(lawyers));
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error updating lawyer:', error);
            return false;
        }
    },

    deleteLawyer(id) {
        try {
            // Delete lawyer
            let lawyers = this.getLawyers();
            lawyers = lawyers.filter(l => l.id !== id);
            localStorage.setItem(this.KEYS.LAWYERS, JSON.stringify(lawyers));

            // Delete associated transactions
            let transactions = this.getTransactions();
            transactions = transactions.filter(t => t.lawyerId !== id);
            localStorage.setItem(this.KEYS.TRANSACTIONS, JSON.stringify(transactions));

            return true;
        } catch (error) {
            console.error('Error deleting lawyer:', error);
            return false;
        }
    },

    // ========== Transactions CRUD Operations ==========
    
    getTransactions() {
        try {
            const data = localStorage.getItem(this.KEYS.TRANSACTIONS);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error getting transactions:', error);
            return [];
        }
    },

    getTransaction(id) {
        return this.getTransactions().find(transaction => transaction.id === id);
    },

    getTransactionsByLawyer(lawyerId) {
        return this.getTransactions().filter(t => t.lawyerId === lawyerId);
    },

    addTransaction(transaction) {
        try {
            const transactions = this.getTransactions();
            transactions.push(transaction);
            localStorage.setItem(this.KEYS.TRANSACTIONS, JSON.stringify(transactions));
            return true;
        } catch (error) {
            console.error('Error adding transaction:', error);
            return false;
        }
    },

    updateTransaction(updatedTransaction) {
        try {
            const transactions = this.getTransactions();
            const index = transactions.findIndex(t => t.id === updatedTransaction.id);
            if (index !== -1) {
                transactions[index] = updatedTransaction;
                localStorage.setItem(this.KEYS.TRANSACTIONS, JSON.stringify(transactions));
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error updating transaction:', error);
            return false;
        }
    },

    deleteTransaction(id) {
        try {
            let transactions = this.getTransactions();
            transactions = transactions.filter(t => t.id !== id);
            localStorage.setItem(this.KEYS.TRANSACTIONS, JSON.stringify(transactions));
            return true;
        } catch (error) {
            console.error('Error deleting transaction:', error);
            return false;
        }
    },

    // ========== Theme Management ==========
    
    getTheme() {
        return localStorage.getItem(this.KEYS.THEME) || 'light';
    },

    setTheme(theme) {
        localStorage.setItem(this.KEYS.THEME, theme);
    },

    // ========== Statistics & Reports ==========
    
    getStatistics() {
        const transactions = this.getTransactions();
        const lawyers = this.getLawyers();

        const totalTransactions = transactions.length;
        const totalPaid = transactions
            .filter(t => t.isPaid)
            .reduce((sum, t) => sum + parseFloat(t.amount), 0);
        const totalUnpaid = transactions
            .filter(t => !t.isPaid)
            .reduce((sum, t) => sum + parseFloat(t.amount), 0);
        const totalLawyers = lawyers.length;

        return {
            totalTransactions,
            totalPaid,
            totalUnpaid,
            totalAmount: totalPaid + totalUnpaid,
            totalLawyers,
            paidCount: transactions.filter(t => t.isPaid).length,
            unpaidCount: transactions.filter(t => !t.isPaid).length
        };
    },

    getLawyerStatistics(lawyerId, dateFrom = null, dateTo = null) {
        let transactions = this.getTransactionsByLawyer(lawyerId);

        // Filter by date range if provided
        if (dateFrom) {
            transactions = transactions.filter(t => new Date(t.date) >= new Date(dateFrom));
        }
        if (dateTo) {
            transactions = transactions.filter(t => new Date(t.date) <= new Date(dateTo));
        }

        const totalTransactions = transactions.length;
        const totalPaid = transactions
            .filter(t => t.isPaid)
            .reduce((sum, t) => sum + parseFloat(t.amount), 0);
        const totalUnpaid = transactions
            .filter(t => !t.isPaid)
            .reduce((sum, t) => sum + parseFloat(t.amount), 0);
        const totalDocuments = transactions
            .reduce((sum, t) => sum + parseInt(t.documentCount), 0);

        return {
            transactions,
            totalTransactions,
            totalPaid,
            totalUnpaid,
            totalAmount: totalPaid + totalUnpaid,
            totalDocuments,
            paidCount: transactions.filter(t => t.isPaid).length,
            unpaidCount: transactions.filter(t => !t.isPaid).length
        };
    },

    // ========== Data Management ==========
    
    clearAllData() {
        localStorage.removeItem(this.KEYS.LAWYERS);
        localStorage.removeItem(this.KEYS.TRANSACTIONS);
    },

    exportData() {
        return {
            lawyers: this.getLawyers(),
            transactions: this.getTransactions(),
            exportDate: new Date().toISOString()
        };
    },

    importData(data) {
        try {
            if (data.lawyers) {
                localStorage.setItem(this.KEYS.LAWYERS, JSON.stringify(data.lawyers));
            }
            if (data.transactions) {
                localStorage.setItem(this.KEYS.TRANSACTIONS, JSON.stringify(data.transactions));
            }
            return true;
        } catch (error) {
            console.error('Error importing data:', error);
            return false;
        }
    }
};

// Initialize storage on load
document.addEventListener('DOMContentLoaded', () => {
    storage.init();
});