/**
 * External Dependencies
 */
import React, { Component, Fragment } from "react";
import classnames from "classnames/dedupe";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Spinner } from "reactstrap";

/**
 * Internal Dependencies
 */
import Icon from "../../components/icon";
import { isValidEmail } from "../../utils";
import api from "./../../utils/api";

import { updateAuth as actionUpdateAuth, updateSettings as actionUpdateSettings } from "../../actions";

/**
 * Component
 */
class Content extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "tech@agenciaonside.com.br",
      emailError: "",
      password: `tech@@on@agencia@#2020`,
      passwordError: "",
      loading: false,
    };

    this.checkEmail = this.checkEmail.bind(this);
    this.checkPassword = this.checkPassword.bind(this);
    this.maybeLogin = this.maybeLogin.bind(this);
  }

  checkEmail() {
    const { email } = this.state;

    const isValid = email && isValidEmail(email);

    this.setState({
      emailError: isValid ? "" : "Formato de email inválido",
    });

    //return isValid;
    return true;
  }

  checkPassword() {
    const { password } = this.state;

    const isValid = password && password.length >= 3;

    this.setState({
      passwordError: isValid ? "" : "A senha deve ter pelo menos 6 caracteres",
    });

    return isValid;
  }

  async maybeLogin() {
    const { updateAuth, updateSettings } = this.props;

    if (this.state.loading) {
      return;
    }

    let isValid = true;
    isValid = this.checkEmail() && isValid;
    isValid = this.checkPassword() && isValid;

    // Form is not valid.
    if (!isValid) {
      return;
    }

    this.setState({
      loading: true,
    });

    // async () => {
    try {
      const { data } = await api.post("/sessions", { email: this.state.email, password: this.state.password });
      if (data) {
        updateSettings({ users: [{ img: data?.user?.image_path, img_profile: data?.user?.image_path, name: data?.user?.name }] });

        updateAuth({
          token: data.token,
          user_id: data?.user?.id,
          user_name: data?.user?.name,
          user_email: data?.user?.email,
          filial_id: data?.user?.filial?.id,
          filial_name: data?.user?.filial?.name,
          user_image_path: data?.user?.image_path,
          profile_id: data?.user?.profile?.id,
          profile_name: data?.user?.profile?.name,
          sales_cancel: data?.user?.sales_cancel,
        });
      }
    } catch (error) {
      console.log(error);

      if (error?.response?.status === 401) {
        this.setState({
          loading: false,
          passwordError: "Usuário ou senha inválidos",
        });
        return;
      } else {
        this.setState({
          loading: false,
          passwordError: "Erro desconhecido! Tente novamente",
        });
      }
      // }

      /* setTimeout(() => {
          updateAuth({
            token: "fake-token",
          });
        }, 600);*/
    }
  }

  render() {
    const { email, emailError, password, passwordError } = this.state;

    return (
      <Fragment>
        <div className="bg-image">
          <div className="bg-grey-1" />
        </div>
        <div className="form rui-sign-form rui-sign-form-cloud">
          <div className="row vertical-gap sm-gap justify-content-center">
            <div className="col-12">
              <h1 className="display-4 mb-10 text-center">Login</h1>
            </div>
            <div className="col-12">
              <input
                type="email"
                className={classnames("form-control", { "is-invalid": emailError })}
                aria-describedby="emailHelp"
                placeholder="Email"
                value={email}
                onChange={e => {
                  this.setState(
                    {
                      email: e.target.value,
                    },
                    emailError ? this.checkEmail : () => {},
                  );
                }}
                onBlur={this.checkEmail}
                disabled={this.state.loading}
              />
              {emailError ? <div className="invalid-feedback">{emailError}</div> : ""}
            </div>
            <div className="col-12">
              <input
                type="password"
                className={classnames("form-control", { "is-invalid": passwordError })}
                placeholder="Password"
                value={password}
                onChange={e => {
                  this.setState(
                    {
                      password: e.target.value,
                    },
                    passwordError ? this.checkPassword : () => {},
                  );
                }}
                onBlur={this.checkPassword}
                disabled={this.state.loading}
              />
              {passwordError ? <div className="invalid-feedback">{passwordError}</div> : ""}
            </div>
            {/*<div className="col-sm-6">
              <div className="custom-control custom-checkbox d-flex justify-content-start">
                <input type="checkbox" className="custom-control-input" id="rememberMe" disabled={this.state.loading} />
                <label className="custom-control-label fs-13" htmlFor="rememberMe">
                  Remember me
                </label>
            </div> 
            </div>
            <div className="col-sm-6">
              <div className="d-flex justify-content-end">
                <Link to="#" className="fs-13">
                  Forget password?
                </Link>
              </div>
            </div>*/}
            <div className="col-12">
              <button className="btn btn-brand btn-block text-center" onClick={this.maybeLogin} disabled={this.state.loading}>
                Entrar
                {this.state.loading ? <Spinner /> : ""}
              </button>
            </div>
            {/*
            <div className="col-12">
              <div className="rui-sign-or mt-2 mb-5">or</div>
            </div>
            <div className="col-12">
              <ul className="rui-social-links">
                <li>
                  <button className="rui-social-github" onClick={this.maybeLogin} disabled={this.state.loading}>
                    <Icon vendor="fa" name={["fab", "github"]} />
                    Github
                  </button>
                </li>
                <li>
                  <button className="rui-social-facebook" onClick={this.maybeLogin} disabled={this.state.loading}>
                    <Icon vendor="fa" name={["fab", "facebook-f"]} />
                    Facebook
                  </button>
                </li>
                <li>
                  <button className="rui-social-google" onClick={this.maybeLogin} disabled={this.state.loading}>
                    <Icon vendor="fa" name={["fab", "google"]} />
                    Google
                  </button>
                </li>
              </ul>
            </div>*/}
          </div>
        </div>
        {/*
        <div className="mt-20 text-grey-5">
          Don&apos;t you have an account?{" "}
          <Link to="/sign-up" className="text-2">
            Sign Up
          </Link>
        </div>
        */}{" "}
      </Fragment>
    );
  }
}

export default connect(
  ({ auth, settings }) => ({
    auth,
    settings,
  }),
  { updateAuth: actionUpdateAuth, updateSettings: actionUpdateSettings },
)(Content);
