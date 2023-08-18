import React, {Component, Suspense} from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';
import {Container} from 'reactstrap';

import {
  AppAside,
  AppBreadcrumb,
  AppFooter,
  AppHeader,
  AppSidebar,
  AppSidebarFooter,
  AppSidebarForm,
  AppSidebarHeader,
  AppSidebarMinimizer,
  AppSidebarNav,
} from '@coreui/react';
// sidebar nav config
import navigation from '../../_nav';
import navigation2 from '../../_nav2';
// routes config
import routes from '../../routes';
import {StorageStrings} from "../../constance/StorageStrings";
import {BASE_URL, USER_ROLE_01} from "../../constance/Constance";

const DefaultAside = React.lazy(() => import('./DefaultAside'));
const DefaultFooter = React.lazy(() => import('./DefaultFooter'));
const DefaultHeader = React.lazy(() => import('./DefaultHeader'));

class DefaultLayout extends Component {
  state = {
    role: null,
  }

  loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>

  signOut(e) {
    e.preventDefault()
    localStorage.clear();
    this.props.history.push(BASE_URL + '/login')
  }

  componentDidMount() {
    if (localStorage.getItem(StorageStrings.LOGGED) !== 'true') {
      this.props.history.push(BASE_URL + '/login')
    }
    this.setState({
      role: localStorage.getItem(StorageStrings.USER_TYPE)
    })
  }

  render() {
    const {role} = this.state;
    return (
      <div className="app">

          <AppHeader fixed>
            <Suspense fallback={this.loading()}>
              <DefaultHeader onLogout={e => this.signOut(e)}/>
            </Suspense>
          </AppHeader>


        <div className="app-body">

            <AppSidebar fixed display="lg">
              <AppSidebarHeader/>
              <AppSidebarForm/>
              <Suspense>

                {role !=='admin' ? (
                  <AppSidebarNav navConfig={navigation} {...this.props} />
                ):(
                  <AppSidebarNav navConfig={navigation2} {...this.props} />
                )}


              </Suspense>
              <AppSidebarFooter/>
              <AppSidebarMinimizer/>
            </AppSidebar>


          <main className="main">
              <AppBreadcrumb appRoutes={routes}/>
            <Container fluid>
              <Suspense fallback={this.loading()}>
                <Switch>
                  {routes.map((route, idx) => {
                    return route.component ? (
                      <Route
                        key={idx}
                        path={route.path}
                        exact={route.exact}
                        name={route.name}
                        render={props => (
                          <route.component {...props} />
                        )}/>
                    ) : null;
                  })}
                  {role !== null && (
                    role !== 'admin' ? (
                      <Redirect from={"/"} to={BASE_URL + "/add-task"}/>
                    ) : (
                      <Redirect from={"/"} to={BASE_URL + "/admin/all-tasks"}/>
                    )
                  )}


                </Switch>
              </Suspense>
            </Container>
          </main>
          <AppAside fixed>
            <Suspense fallback={this.loading()}>
              <DefaultAside/>
            </Suspense>
          </AppAside>
        </div>
          <AppFooter>
            <Suspense fallback={this.loading()}>
              <DefaultFooter/>
            </Suspense>
          </AppFooter>
      </div>
    );
  }
}

export default DefaultLayout;
