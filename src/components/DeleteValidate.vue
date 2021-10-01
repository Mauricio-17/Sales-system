<template>
    <v-dialog
      v-model="dialog"
      persistent
      max-width="300"
    >

        <v-card>
            <v-container>
                <v-row justify="center">
                    <v-col>
                        <h1>
                            ¿DESEA ELIMINAR EL ITEM?
                        </h1>
                    </v-col>
                </v-row>
                <v-row justify="center">
                    <v-col cols="4">
                        <v-btn
                        color="warning"
                        @click="closeDialog"
                        >
                            NO
                        </v-btn>
                    </v-col>
                    <v-col cols="4">
                        <v-btn 
                        color="primary"
                        @click="confirm"
                        >
                            SI
                        </v-btn>
                    </v-col>
                </v-row>
            </v-container>
        </v-card>
    </v-dialog>
</template>
<script>
export default {
    props:{
        dialog : Boolean,
        id : String,
    },
    data() {
        return {

        }
    },
    methods:{
        closeDialog(){
            this.$emit('close')
        },
        confirm(){
            this.$emit('remove', this.id)
        }
    }
}
</script>