import React, { useState } from 'react';
import axios from 'axios';
import { Container, Typography, TextField, Snackbar, Box} from '@mui/material';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n/i18next.js';

const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

export const EditUser = ({userName}) => {

    const { t } = useTranslation();

    return (
        <Form >
            <Form.Group className="mb-3" controlId="formBasic">
                <Form.Label>{t('user-name-edit')}</Form.Label>
                <Form.Control type="name" placeholder= {userName} disabled />
                <Form.Text className="text-muted">
                    {t('not-edit-permission')}
                </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>{t('password-edit')}</Form.Label>
                <Form.Control type="password" placeholder={t('password-placeholder')} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>{t('password-edit-confirm')}</Form.Label>
                <Form.Control type="password" placeholder={t('password-placeholder')} />
            </Form.Group>
            <Button className='end-0' type="submit" style={{ backgroundColor: '#FEB06A' ,borderColor: '#FEB06A',  color:"#5D6C89"}}>
                {t('save-changes-button')}
            </Button>
        </Form>
      );
}