<template>
    <v-simple-table fixed-header height="300px"
    dense>
        <template v-slot:default>
        <thead>
            <tr>
                <th class="text-left">
                    PRODUCTO
                </th>
                <th class="text-left">
                    CANTIDAD
                </th>
                <th class="text-left">
                    PRECIO ( S/. )
                </th>
                <th class="text-left">
                    MONTO
                </th>
                <th class="text-left"
                v-if="visible"
                >
                    OPCIÓN
                </th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(item, index) in orders" :key="index">
                <td>{{ item.namePro }}</td>
                <td>{{ item.amount }}</td>
                <td>{{ item.price }}</td>
                <td>{{ item.total }}</td>
                <td v-if="visible">
                    <v-btn 
                    @click="removeOrder(index)"
                    color="error">
                        <v-icon>{{ icons.mdiDelete }}</v-icon>
                    </v-btn>
                </td>
            </tr>
        </tbody>
        </template>
    </v-simple-table>
</template>

<script>
//@ts-check
import { mapActions, mapState } from 'vuex'
import {
    mdiDelete,
  } from '@mdi/js'
export default {
    props:{
        visible:{
            type: Boolean,
            default: true,
        }
    },
    data() {
        return {
            icons: {
                mdiDelete,
            },
        }
    },
    computed:{
        ...mapState(['orders'])
    },
    methods: {
        removeOrder(index){
            this.$emit("remove", index)
        }
    }
}
</script>