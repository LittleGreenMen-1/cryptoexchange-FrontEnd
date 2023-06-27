import React from 'react'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import { useFormik } from 'formik'
import registerPhoto from '../../utils/img/RegisterPhoto.png'
import axios from 'axios'
import * as Yup from 'yup'
import './register.css'

const Register = () => {
	const handleRegisterClick = () => {
		axios
			.post(
				'http://localhost:1234/register',
				{
					username: formik.values.username,
					email: formik.values.email,
					displayName: formik.values.displayName,
					password: formik.values.password,
				},
				{ withCredentials: true },
			)
			.then((response) => {
				if(response.status === 200){
					window.location = '/'
				}
			})
			.catch((error) => {
				console.log(error)
			})
	}

	const registerSchema = Yup.object({
		username: Yup.string()
			.min(2, 'Too short')
			.max(50, 'Too long')
			.required(),
		email: Yup.string().email().required(),
		displayName: Yup.string()
			.min(3, 'Too short')
			.max(50, 'Too long')
			.required(),
		password: Yup.string()
			.min(2, 'Too short')
			.max(50, 'Too long')
			.required(),
		confirmPassword: Yup.string()
			.min(2, 'Too short')
			.oneOf([Yup.ref('password'), null], 'Passwords must match'),
	})

	const formik = useFormik({
		initialValues: {
			username: '',
			email: '',
			displayName: '',
			password: '',
			confirmPassword: '',
		},
		validationSchema: registerSchema,
	})

	return (
		<div className="mainWrapper">
			<Paper className="columnsWrapper" elevation={8}>
				<div className="flexLeft">
					<div className="registerText">
						<Typography variant="h3">Register</Typography>
					</div>
					<form autoComplete="off" onSubmit={formik.handleSubmit}>
						<TextField
							fullWidth
							name="username"
							label="Username"
							variant="outlined"
							value={formik.values.username}
							onChange={formik.handleChange}
							error={
								formik.values.username && formik.errors.username
							}
							helperText={
								formik.values.username && formik.errors.username
							}
						/>
						<TextField
							fullWidth
							name="email"
							label="Email"
							variant="outlined"
							value={formik.values.email}
							onChange={formik.handleChange}
							error={formik.values.email && formik.errors.email}
							helperText={
								formik.values.email && formik.errors.email
							}
						/>
						<TextField
							fullWidth
							name="displayName"
							label="Name"
							variant="outlined"
							value={formik.values.name}
							onChange={formik.handleChange}
							error={
								formik.values.displayName &&
								formik.errors.displayName
							}
							helperText={
								formik.values.displayName &&
								formik.errors.displayName
							}
						/>
						<TextField
							fullWidth
							name="password"
							label="Password"
							variant="outlined"
							value={formik.values.password}
							onChange={formik.handleChange}
							type="password"
							error={
								formik.values.password && formik.errors.password
							}
							helperText={
								formik.values.password && formik.errors.password
							}
						/>
						<TextField
							fullWidth
							name="confirmPassword"
							label="Confirm Password"
							variant="outlined"
							value={formik.values.confirmPassword}
							onChange={formik.handleChange}
							type="password"
							error={
								formik.values.confirmPassword &&
								formik.errors.confirmPassword
							}
							helperText={
								formik.values.confirmPassword &&
								formik.errors.confirmPassword
							}
						/>
						<div className="registerButton">
							<Button
								className="registerButton"
								variant="contained"
								onClick={handleRegisterClick}
							>
								Register
							</Button>
						</div>
					</form>
				</div>
				<img
					className="flexRight"
					src={registerPhoto}
					alt="Register Logo"
				/>
			</Paper>
		</div>
	)
}

export default Register