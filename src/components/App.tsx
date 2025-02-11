import {
  Box,
  Flex,
  Grid,
  GridItem,
  IconButton,
  Image,
  Spinner,
  Stack,
  useMediaQuery,
} from "@chakra-ui/react";
import {
  createHashHistory,
  Outlet,
  parseSearchWith,
  ReactLocation,
  Route,
  Router,
  stringifySearchWith,
} from "@tanstack/react-location";
import { useStore } from "effector-react";
import { useEffect } from "react";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import { BiArrowToLeft, BiArrowToRight } from "react-icons/bi";
import {
  CategoryForm,
  DashboardForm,
  DataSourceForm,
  IndicatorForm,
} from "../components/forms";
import Denominator from "../components/forms/Denominator";
import Numerator from "../components/forms/Numerator";
import Home from "../components/Home";
import {
  Categories,
  Dashboards,
  DataSources,
  Indicators,
} from "../components/lists";
import Section from "../components/Section";
import {
  setCurrentPage,
  setIsFullScreen,
  setIsNotDesktop,
  setShowFooter,
  setShowSider,
} from "../Events";
import { LocationGenerics } from "../interfaces";
import { useInitials } from "../Queries";
import { $dimensions, $store } from "../Store";
import { decodeFromBinary, encodeToBinary } from "../utils/utils";
import { otherHeaders, padding, sideWidth } from "./constants";
import DashboardMenu from "./DashboardMenu";
import Footer from "./Footer";
import MOHLogo from "./MOHLogo";
import MOHLogo2 from "./MOHLogo2";
import SectionMenu from "./SectionMenu";
import SidebarContent from "./SidebarContent";

const history = createHashHistory();
const location = new ReactLocation<LocationGenerics>({
  history,
  parseSearch: parseSearchWith((value) => JSON.parse(decodeFromBinary(value))),
  stringifySearch: stringifySearchWith((value) =>
    encodeToBinary(JSON.stringify(value))
  ),
});

const App = () => {
  const { isLoading, isSuccess, isError, error } = useInitials();
  const store = useStore($store);
  const { dashboardHeight, dashboardColumns, dashboardWidth, showSide } =
    useStore($dimensions);
  const handle = useFullScreenHandle();
  const topMenuOptions: { [key: string]: any } = {
    dashboard: <DashboardMenu />,
    sections: <SectionMenu />,
  };
  const [isNotDesktop] = useMediaQuery(["(max-width: 992px)"]);

  useEffect(() => {
    setIsNotDesktop(isNotDesktop);
  }, [isNotDesktop]);

  useEffect(() => {
    const callback = async (event: KeyboardEvent) => {
      if (event.key === "F5" || event.key === "f5") {
        await handle.enter();
        if (handle.active) {
          setIsFullScreen(true);
        } else {
          setShowSider(true);
          setIsFullScreen(true);
        }
      }
    };
    document.addEventListener("keydown", callback);
    return () => {
      document.removeEventListener("keydown", callback);
    };
  }, []);

  const routes: Route<LocationGenerics>[] = [
    {
      loader: async () => {
        setCurrentPage("");
        return {};
      },
      path: "/",
      element: <Home />,
    },
    {
      path: "/categories",

      children: [
        {
          path: "/",
          element: <Categories />,
          loader: async () => {
            setCurrentPage("categories");
            setShowSider(true);
            return {};
          },
        },
        {
          path: ":categoryId",
          element: <CategoryForm />,
          loader: () => {
            setCurrentPage("category");
            setShowFooter(false);
            setShowSider(true);
            return {};
          },
        },
      ],
    },
    {
      path: "/data-sources",
      children: [
        {
          path: "/",
          element: <DataSources />,
          loader: () => {
            setCurrentPage("data-sources");
            setShowFooter(false);
            setShowSider(true);
            return {};
          },
        },
        {
          path: ":dataSourceId",
          element: <DataSourceForm />,
          loader: () => {
            setCurrentPage("data-source");
            setShowFooter(false);
            return {};
          },
        },
      ],
    },
    {
      path: "/dashboards",
      children: [
        {
          path: "/",
          element: <Dashboards />,
          loader: () => {
            setCurrentPage("dashboards");
            setShowFooter(false);
            setShowSider(true);
            return {};
          },
        },
        {
          path: ":dashboardId",
          children: [
            {
              path: "/",
              element: <DashboardForm />,
              loader: () => {
                setCurrentPage("dashboard");
                setShowFooter(true);
                setShowSider(true);
                return {};
              },
            },
            {
              path: "section",
              element: <Section />,
              loader: async () => {
                setCurrentPage("sections");
                setShowFooter(false);
                return {};
              },
            },
          ],
        },
      ],
    },
    {
      path: "/indicators",
      children: [
        {
          path: "/",
          element: <Indicators />,
          loader: () => {
            setCurrentPage("indicators");
            setShowFooter(false);
            setShowSider(true);
            return {};
          },
        },
        {
          path: ":indicatorId",
          children: [
            {
              path: "/",
              element: <IndicatorForm />,
              loader: () => {
                setShowFooter(false);
                setCurrentPage("indicator");
                setShowSider(true);
                return {};
              },
            },
            { path: "/numerator", element: <Numerator /> },
            { path: "/denominator", element: <Denominator /> },
          ],
        },
      ],
    },
  ];

  return (
    <>
      {isLoading && (
        <Flex
          w="100%"
          alignItems="center"
          justifyContent="center"
          h="calc(100vh - 48px)"
        >
          <Spinner />
        </Flex>
      )}
      {isSuccess && (
        <Router
          location={location}
          routes={routes}
          defaultPendingElement={<Spinner />}
        >
          <Grid
            templateColumns={{ md: "auto", lg: dashboardColumns }}
            maxH={{ md: "calc(100vh - 48px)" }}
            h={{ md: "calc(100vh - 48px)" }}
            p={`${padding}px`}
            w="100vw"
            maxW="100vw"
          >
            {showSide && (
              <Grid
                templateRows={`${otherHeaders}px 1fr ${otherHeaders}px`}
                pr={`${padding}px`}
                gap={`${padding}px`}
                h={dashboardHeight}
                maxH={dashboardHeight}
              >
                <Stack
                  h="100%"
                  w="100%"
                  alignItems="center"
                  alignContent="center"
                  justifyContent="center"
                  justifyItems="center"
                >
                  <MOHLogo height={otherHeaders} width={sideWidth} />
                </Stack>
                <GridItem>
                  <SidebarContent />
                </GridItem>
                <Stack
                  h="100%"
                  w="100%"
                  alignItems="center"
                  alignContent="center"
                  justifyContent="center"
                  justifyItems="center"
                >
                  <Image
                    src="https://raw.githubusercontent.com/HISP-Uganda/covid-dashboard/master/src/images/logo.png"
                    maxH={`${otherHeaders}px`}
                    maxW={`${sideWidth}px`}
                  />
                </Stack>
              </Grid>
            )}
            <FullScreen handle={handle}>
              <Grid
                templateRows={`${otherHeaders}px 1fr ${otherHeaders}px`}
                gap={`${padding}px`}
                w={dashboardWidth}
                maxW={dashboardWidth}
                h={handle.active ? "100vh" : dashboardHeight}
                maxH={handle.active ? "100vh" : dashboardHeight}
                bgColor={handle.active ? "gray.300" : ""}
              >
                <GridItem
                  h="100%"
                  w={dashboardWidth}
                  maxW={dashboardWidth}
                  bgColor="white"
                  p="5px"
                >
                  <Stack
                    h="100%"
                    alignContent="center"
                    alignItems="center"
                    direction="row"
                    w="100%"
                    spacing="40px"
                  >
                    {(handle.active || !showSide) && (
                      <MOHLogo2>
                        <Image
                          src="https://raw.githubusercontent.com/HISP-Uganda/covid-dashboard/master/src/images/Coat_of_arms_of_Uganda.svg"
                          maxH={`${otherHeaders}px`}
                          maxW={`${sideWidth}px`}
                        />
                      </MOHLogo2>
                    )}
                    {!handle.active && !store.showSider && (
                      <IconButton
                        bgColor="none"
                        variant="ghost"
                        aria-label="Search database"
                        icon={<BiArrowToRight />}
                        onClick={() => setShowSider(true)}
                        _hover={{ bg: "none" }}
                      />
                    )}
                    {!handle.active && store.showSider && (
                      <IconButton
                        variant="ghost"
                        bgColor="none"
                        aria-label="Search database"
                        icon={<BiArrowToLeft />}
                        onClick={() => setShowSider(false)}
                        _hover={{ bg: "none" }}
                      />
                    )}
                    {topMenuOptions[store.currentPage]}
                  </Stack>
                </GridItem>
                <GridItem>
                  <Outlet />
                </GridItem>
                <GridItem
                  w={dashboardWidth}
                  maxW={dashboardWidth}
                  bgColor="white"
                >
                  <Footer handle={handle} />
                </GridItem>
              </Grid>
            </FullScreen>
          </Grid>
        </Router>
      )}

      {isError && <Box>{error?.message}</Box>}
    </>
  );
};

export default App;
