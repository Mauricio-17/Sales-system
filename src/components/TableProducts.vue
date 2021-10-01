<template>
    <v-simple-table fixed-header height="300px"
    dense>
        <template v-slot:default>
            <thead>
                <tr>
                <th class="text-left">
                    CATEGORIA
                </th>
                <th class="text-left">
                    NOMBRE
                </th>
                <th class="text-left">
                    PRECIO
                </th>
                <th class="text-left">
                    STOCK
                </th>
                <th class="text-left">
                    ESTADO
                </th>
                <th class="text-left">
                    OPCIÓN
                </th>
                </tr>
            </thead>

            <tbody>
                <tr v-for="(item, index) in proFiltered" :key="index">
                    <td>{{ nameCategories[index] }}</td>
                    <td>{{ item.name }}</td>
                    <td>{{ item.price }}</td>
                    <td>{{ item.stock }}</td>
                    <td>
                        {{ item.state ? "Habilitado" : "Inhabilitado" }}
                    </td>
                    <td v-if="visible">
                        <v-btn 
                        @click="openValidate"
                        color="error"
                        >
                            <delete-validate 
                            :dialog="dialogValidate" 
                            :id="item.id" @close="closeValidate"
                            @remove="removeProduct"
                            />
                            <v-icon >
                                {{ icons.mdiDelete }}
                            </v-icon>
                        </v-btn>
                        <v-btn 
                        @click="setProduct(item)"
                        color="warning"
                        >
                            <v-icon>{{ icons.mdiPencil }}</v-icon>
                        </v-btn>
                    </td>
                    <td v-else>
                        <v-btn 
                        @click="selectProduct(index)"
                        :disabled="!item.state || (object.amount <= 0 || object.amount > item.stock)"
                        color="primary"
                        >
                            <v-icon>fas fa-check-square</v-icon>
                        </v-btn>
                    </td>
                </tr>
            </tbody>
        </template>
    </v-simple-table>
</template>
<script>
//@ts-check
import { mapActions, mapState } from 'vuex';
import {
    mdiAccount,
    mdiPencil,
    mdiShareVariant,
    mdiDelete,
  } from '@mdi/js'
import DeleteValidate from './DeleteValidate.vue';

export default {
  components: { DeleteValidate },
    props:{
        nameCategories: Array,
        visible:{
            type: Boolean,
            default: true
        },
        object:{
            type: Object,
            required: false,
        }
    },
    data: () => {
        return {
            icons: {
                mdiAccount,
                mdiPencil,
                mdiShareVariant,
                mdiDelete,
            },
            dialogValidate: false
        };
    },
    computed:{
        ...mapState(['proFiltered']),
    },
    methods:{
        ...mapActions(['deleteProduct']),
        setProduct(item){
            this.$emit('action',item)
        },
        selectProduct(index){
            this.$emit('select', index)
        },
        openValidate(){
            this.dialogValidate = true;
            //console.log(1)
        },
        closeValidate(){
            this.dialogValidate = false
        },
        async removeProduct(id){
            await this.deleteProduct(id)
            this.closeValidate()
        }
    }
};
</script>
