import { useState,useEffect } from 'react';

export const formRegex = {
    EMAIL:'^[a-zA-Z0-9._:$!%-]+@+[a-zA-Z0-9.-]+.[a-zA-Z]$',
    GENERAL_NUMBER:'^[0-9]+$',
    CHARACTERS:'^[a-zA-Z]+$',
    CARD_NUMBER:'[0-9]{16}$',
    ACCOUNT_NUMBER:'[0-9]{18}$',
    AF_40:'^[A-Za-z0-9_ ]{1,40}$',
    AF_20:'^[A-Za-z0-9_ ]{1,20}$',
    CLABE:'[0-9]{18}$',
    CLABECARD:'[0-9]{16,18}$',
    REFERENCE:'^[A-Za-z0-9_ ]{0,30}$',
    PHONE:'^[0-9]{10}$',
    NAME:'^[A-Za-z ]{0,40}$',
}

export const useForm = ( initialForm = {} ) => {

    const [ formState, setFormState ] = useState( initialForm );
    const [formValidateFields, setformValidateFields] = useState({});

    const onValidateRegex = (formFieldValue,validateType=formRegex.NUMBER) =>{
        return !(new RegExp(validateType).test(formFieldValue));
    }

    const onValidateFieldBy = (formField,formFieldValue,validateType=formRegex.NUMBER) =>{
            setformValidateFields(
            {
                ...formValidateFields,
                [ formField ]: onValidateRegex(formFieldValue,validateType)
            }
        )
    }

    const onInputBlurValidate = ({ target }) => {
      const { name, value, className,maxLength } = target;

      let valFinal = value;
      if(-1 != maxLength){
        valFinal = value.toString().substr(0,maxLength).trim();
      }

      Object.keys(formRegex).map((element) => {
        if (className.includes(element)) {
          setformValidateFields({
            ...formValidateFields,
            [name]: onValidateRegex(valFinal, formRegex[element]),
          });
        }
      });
    }; 

    const onValidateGlobalFields = (fields = {}) =>{
        setformValidateFields({
            ...formValidateFields,
            ...fields
        })
    } 


    const onInputChange = ({ target }) => {
        const { name, value, className,maxLength } = target;
        let valFinal = value;
        if(-1 != maxLength){
          valFinal = value.toString().substr(0,maxLength).trim();
        }
        setFormState({
            ...formState,
            [ name ]: valFinal
        });
    }

    const onInputChangeBy = (name, value) => {
        setFormState({
            ...formState,
            [ name ]: value
        });
    }

    const onResetForm = () => {
        setFormState( initialForm );
    }

    const onChangeFormGlobalState = (globalState = {}) =>{
        setFormState({
            ...formState,
            ...globalState
            })
    }

    const setDefaultValuesInFormValidation = (init={}) => {
        let initialFormAux = {};
        Object.keys(init).map(element => {
            initialFormAux[element]=false
        })
        return initialFormAux;
    }


    useEffect(() => {
        setformValidateFields({
            ...formValidateFields,
            ...setDefaultValuesInFormValidation(initialForm)
        })
    }, []);

    return {
        ...formState,
        formValidateFields,
        formState,
        onChangeFormGlobalState,
        onInputChange,
        onInputChangeBy,
        onResetForm,
        onValidateFieldBy,
        onValidateGlobalFields,
        onValidateRegex,
        onInputBlurValidate
    }
}
