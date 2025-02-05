new Vue({
    el: '#app',
    data: {
        columns: [
            { title: 'Новые задачи', cards: [] },
            { title: 'Задачи выполненые на половину', cards: [] },
            { title: 'Выполненые задачи', cards: [] },
        ],
        newTaskText: [],
        newCardTitle: [],
    },
    methods: {
        formatDate(date) {
            const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
            return date.toLocaleString('ru-RU', options);
        },
        isEditable(index) {
            return index === 0 ? this.columns[0].cards.length < 3 : true;
        },
        addCard(columnIndex) {
            if (this.newCardTitle[columnIndex].trim() === '') return;

            const newCard = {
                title: this.newCardTitle[columnIndex],
                items: [],
                completedItems: 0,
                completedAt: null
            };

            this.columns[columnIndex].cards.push(newCard);
            this.newCardTitle[columnIndex] = '';
            this.saveData();
        },
        addTask(card) {
            const taskText = this.newTaskText[this.columns.findIndex(column => column.cards.includes(card))];

            if (taskText && taskText.trim() !== '') {
                if (card.items.length < 5){
                    card.items.push({ text: taskText, completed: false, completedAt: null });
                    this.newTaskText[this.columns.findIndex(column => column.cards.includes(card))] = '';
                    this.saveData();
                }
                else {
                    document.getElementById('error').innerHTML = "Максимум 5 задач"
                }
            }
        },
        updateCompletion(card) {
            const completedCount = card.items.filter(item => item.completed).length;
            card.completedItems = completedCount;

            const totalTasks = card.items.length;

            if (totalTasks > 0) {
                if (completedCount > totalTasks / 2) {
                    const currentColumnIndex = this.columns.findIndex(column => column.cards.includes(card));
                    if (currentColumnIndex < this.columns.length - 1) {
                        this.columns[currentColumnIndex + 1].cards.push(card);
                        this.columns[currentColumnIndex].cards.splice(this.columns[currentColumnIndex].cards.indexOf(card), 1);
                        this.saveData();
                    }
                }

                if (completedCount === totalTasks) {
                    const currentColumnIndex = this.columns.findIndex(column => column.cards.includes(card));
                        card.completedAt = new Date().toLocaleString();
                        this.columns[this.columns.length - 1].cards.push(card);
                        this.columns[currentColumnIndex].cards.splice(this.columns[currentColumnIndex].cards.indexOf(card), 1);
                        this.saveData();
                }
            }
        },
        saveData() {
            localStorage.setItem('taskManagerData', JSON.stringify(this.columns));
        },
        clearStorage() {
            localStorage.removeItem('taskManagerData');
            this.columns = [
                { title: 'Новые задачи', cards: [] },
                { title: 'Задачи выполненые на половину', cards: [] },
                { title: 'Выполненые задачи', cards: [] },
            ];
        }
    },
    mounted() {
        const savedData = localStorage.getItem('taskManagerData');
        if (savedData) {
            this.columns = JSON.parse(savedData);
        }
    }
});