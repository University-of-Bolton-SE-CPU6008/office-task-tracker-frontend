import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {Badge, DropdownItem, DropdownMenu, DropdownToggle, Nav, NavItem, NavLink} from 'reactstrap';
import PropTypes from 'prop-types';

import {AppAsideToggler, AppHeaderDropdown, AppNavbarBrand, AppSidebarToggler} from '@coreui/react';
import logo from '../../assets/img/brand/singleLogo.png';
import Admin from '../../assets/img/brand/admin.png';
import * as CommonFunc from '../../utils/CommonFunc';
import swal from "sweetalert";
import * as constants from "../../constance/Constance";
import {StorageStrings} from "../../constance/StorageStrings";

const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {};

class DefaultHeader extends Component {

  logoutHandler = async (e) => {
    swal({
      title: "Are you sure",
      text: "you want to logout?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
      className:"swal-footer"
    })
      .then((willDelete) => {
        if (willDelete) {
          CommonFunc.removeCookiesValues();
          CommonFunc.clearLocalStorage();
          this.props.onLogout(e);
        }
      });
  }


  render() {

    // eslint-disable-next-line
    const {children, ...attributes} = this.props;

    return (
      <React.Fragment>
        <AppSidebarToggler className="d-lg-none" display="md" mobile/>
        <AppNavbarBrand
          full={{src: logo, width: 140, height: 40, alt: 'CoreUI Logo'}}
          minimized={{src: logo, width: 30, height: 30, alt: 'CoreUI Logo'}}
        />

        <AppSidebarToggler className="d-md-down-none" display="lg"/>

        <Nav className="d-md-down-none" navbar>
        </Nav>
        <Nav className="ml-auto" navbar>
          <AppHeaderDropdown direction="down">
            <DropdownToggle nav>
              <img src={Admin} className="img-avatar"/>
            </DropdownToggle>
            <DropdownMenu right style={{right: 'auto'}}>
              <DropdownItem header tag="div" className="text-center"><strong>Account</strong></DropdownItem>
              <DropdownItem onClick={()=>window.location = constants.BASE_URL + '/change-password'}><i className="icon-wrench"></i> Change Password</DropdownItem>
              <DropdownItem onClick={e => this.logoutHandler(e)}>
                <i className="icon-logout"></i> Logout</DropdownItem>
            </DropdownMenu>
          </AppHeaderDropdown>
        </Nav>
      </React.Fragment>
    );
  }
}

DefaultHeader.propTypes = propTypes;
DefaultHeader.defaultProps = defaultProps;

export default DefaultHeader;
