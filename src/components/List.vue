<template>
    <div class="wrapper">
        <div class="header">
            <a href="#" @click.prevent="addColumn">Add Column</a> | <a href="#" @click.prevent="dump">Export</a>
        </div>
        <modal name="modal-form-column" height="auto" @closed="reset">
            <div class="modal-form">
                <div class="form-group">
                    <label class="form-group__label">Title</label>
                    <input v-model="columnTitle" class="form-group__text" type="text">
                </div>
            </div>
            <div class="btn-set">
                <button class="btn btn-default" style="margin-right: 1rem" @click="saveColumn">Save</button>
                <button class="btn btn-alert" @click="closeModal">Cancel</button>
            </div>
        </modal>
        <modal name="modal-form" height="auto" @closed="reset">
            <div class="modal-form">
                <div class="form-group">
                    <label class="form-group__label">Title</label>
                    <input v-model="title" class="form-group__text" type="text">
                </div>
                <div class="form-group">
                    <label class="form-group__label">Description</label>
                    <textarea v-model="description" class="form-group__text" rows="2"></textarea>
                </div>
            </div>
            <div class="btn-set">
                <button class="btn btn-default" style="margin-right: 1rem" @click="save">Save</button>
                <button class="btn btn-alert" @click="closeModal">Cancel</button>
            </div>
        </modal>
        <div class="content">
            <div class="column m-1" v-for="(column, index) in columns" :key="index">
                <draggable :list="columns" group="column" @start="drag=false" @change="updateColumns">
                    <a href="#" @click.prevent="addCardToColumn(column.id, index)">Add Card</a> | <a href="#" @click.prevent="dropColumn(column)">Delete Column</a>
                    <h1 class="column__header">{{ column.name }}</h1>
                    <draggable :list="column.cards" group="task" @start="drag=false" @change="updateColumns" handle=".card__handle">
                        <div class="card" v-for="card in column.cards" :key="card.id" @click="showModal(card.id, card.title, card.description)">
                            <font-awesome-icon icon="fa-solid fa-arrows-up-down-left-right" size="lg" class="card__handle" pull="right"/>
                            {{ card.title }}
                        </div>
                    </draggable>
                </draggable>
            </div>
        </div>
    </div>
</template>
<script>
import draggable from "vuedraggable";
import '../../public/style.scss'
import { mapActions, mapGetters } from 'vuex'

export default {
    components: {
        draggable
    },
    data() {
        return {
            id: "",
            title: "",
            description: "",
            columnId: "",
            columnIndex: "",
            columnTitle: "",
        }
    },
    computed: {
        ...mapGetters('column', [
            'columns'
        ]),
    },
    methods: {
        ...mapActions('column', [
            'fetchColumns',
            'updateColumns',
            'updateCard',
            'addCard',
            'dropColumn',
            'createColumn',
            'exportDB',
        ]),
        showModal(id, title, description) {
            this.title = title
            this.description = description
            this.id = id
            this.$modal.show('modal-form');
        },
        reset() {
            this.id = ""
            this.title = ""
            this.description = ""
            this.columnId = ""
            this.columnIndex = ""
            this.columnTitle = ""
        },
        closeModal() {
            this.reset()
            this.$modal.hide('modal-form');
            this.$modal.hide('modal-form-column');
        },
        save() {
            if (this.id) {
                this.updateCard({ id: this.id, title: this.title, description: this.description }).then(() => {
                    this.closeModal()
                })
            } else {
                this.addCard({ title: this.title, description: this.description, column: this.columnId, index: this.columnIndex }).then(() => {
                    this.closeModal()
                })
            }
        },
        addCardToColumn(columnId, index) {
            this.columnId = columnId
            this.columnIndex = index
            this.$modal.show('modal-form');
        },
        addColumn() {
            this.$modal.show('modal-form-column');
        },
        saveColumn() {
            this.createColumn({ name: this.columnTitle }).then(() => {
                this.closeModal()
            })
        },
        dump() {
            this.exportDB().then((response) => {
                const blob = new Blob([response.data], { type: 'application/sql' })
                const link = document.createElement('a')
                link.href = URL.createObjectURL(blob)
                link.download = 'dump.sql'
                link.click()
                URL.revokeObjectURL(link.href)
            })
        }
    },
    created() {
        this.fetchColumns()
    }
}
</script>
