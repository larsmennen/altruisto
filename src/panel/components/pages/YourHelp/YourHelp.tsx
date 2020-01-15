import React, { useEffect, useState } from "react"
import LinearProgress from "@material-ui/core/LinearProgress"
import { withStyles } from "@material-ui/core/styles"
import { useAuthContext } from "../../../common/auth"
import Tile from "../../ui/Tile"
import transformUsdToBeingsSaved, {
  IMPACT_COST_IN_USD,
  spreadUSDBetweenAllForMaxImpact,
  ImpactSpreadingResult
} from "../../../common/utils/transform-usd-to-beings-saved"
import mosquito from "../../../assets/mosquito.svg"
import medicine from "../../../assets/medicine.svg"
import family from "../../../assets/family.svg"
import axios from "../../../../helpers/api"
import { Loader } from "../../ui/Loader"
import { useSnackbar } from "notistack"

type Props = {
  onRequestLogin: () => void
  isActive: boolean
}

type Help = {
  moneyRaised: number
  impact: ImpactSpreadingResult
  moneyLeft: number
}

const StyledLinearProgress = withStyles({
  determinate: {
    backgroundColor: "lightgrey",
    height: 6,
    borderRadius: 4
  }
})(LinearProgress)

const ProgressBar = props => {
  const [timedValue, setTimedValue] = useState(0)
  const { value, ...rest } = props
  useEffect(() => {
    setTimeout(() => {
      setTimedValue(value)
    }, 300)
  }, [])

  return <StyledLinearProgress value={timedValue} {...rest} />
}

// TODO: put the correct url for "FIND OUT WHY" link
// TODO: make currency used based on user's settings
export const YourHelp: React.FC<Props> = (props: Props) => {
  const auth = useAuthContext()
  const { enqueueSnackbar } = useSnackbar()
  const [help, setHelp] = useState<Help | null>(null)
  const [error, setError] = useState<Boolean | string>(null)

  useEffect(() => {
    if (auth.user) {
      axios
        .get("/user", {
          headers: {
            "X-AUTH-TOKEN": auth.user.apiKey
          }
        })
        .then(response => {
          const moneyRaised = Number(response.data.money_raised)
          const [impact, moneyLeft] = spreadUSDBetweenAllForMaxImpact(
            moneyRaised
          )
          setHelp({
            moneyRaised,
            impact,
            moneyLeft
          })
        })
        .catch(() => {
          setError(
            "We couldn't get the data about yout impact. Please try again in a moment."
          )
        })
    }
  }, [])

  if (!auth.user) {
    return (
      <div className="page">
        <div className="container fill-height">
          <div className="justify-center fill-height">
            <h2 className="text-center">
              To see the exact impact you had with your online shopping you need
              to sign up.
            </h2>
            <button
              className="button m-b-20"
              onClick={() => props.onRequestLogin && props.onRequestLogin()}
            >
              Sign up
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!help) {
    return (
      <div className="page">
        <div className="container fill-height">
          <div className="justify-center fill-height text-center">
            {error}
            <Loader color={"red"} size={42} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      <div className="container fill-height">
        <div className="justify-center fill-height">
          {help.moneyRaised === 0 ? (
            <>
              <h2 className="text-center">
                Make your first purchase with Altruisto to see how much impact
                you can have!
              </h2>
              <a
                href="https://altruisto.com/partners"
                target="_blank"
                rel="noreferrer noopener"
              >
                <button className="button m-b-20">See our partner shops</button>
              </a>
              <p className="text-center">
                Some puchases take up to several weeks to be processed{" "}
              </p>
              <a
                href="https://altruisto.com/purchase-processing"
                target="_blank"
                rel="noreferrer noopener"
                className="button-link uppercase-link m-b-20 text-center"
              >
                FIND OUT WHY
              </a>
            </>
          ) : (
            <div className="fill-height">
              <div className="col-6">
                <div className="page__title m-b-0">
                  <h1>Your help:</h1>
                </div>
                {help.impact["SCI"] ? (
                  <Tile
                    title={String(help.impact["SCI"])}
                    icon={
                      <img
                        src={medicine}
                        style={{
                          maxHeight: "24px",
                          maxWidth: "24px",
                          minHeight: "24px",
                          minWidth: "24px"
                        }}
                      />
                    }
                    className="m-b-20"
                  >
                    children <strong>cured from parasites</strong>
                  </Tile>
                ) : (
                  <>
                    <strong>You are so close to helping first person!</strong>
                    <br />
                    <span>
                      Collect another $
                      {Math.round(
                        (IMPACT_COST_IN_USD["SCI"] - help.moneyLeft) * 100
                      ) / 100}{" "}
                      to help cure first child from parasites
                    </span>
                    {props.isActive ? (
                      <ProgressBar
                        color="secondary"
                        variant="determinate"
                        value={Math.round(
                          (help.moneyLeft / IMPACT_COST_IN_USD["SCI"]) * 100
                        )}
                        className="m-t-10"
                      />
                    ) : null}
                  </>
                )}

                {help.impact["AMF"] ? (
                  <Tile
                    title={String(help.impact["AMF"])}
                    icon={
                      <img
                        src={mosquito}
                        style={{
                          maxHeight: "24px",
                          maxWidth: "24px",
                          minHeight: "24px",
                          minWidth: "24px"
                        }}
                      />
                    }
                    className="m-b-20"
                  >
                    people <strong>protected from malaria</strong>
                  </Tile>
                ) : null}

                {help.impact["GD"] ? (
                  <Tile
                    title={String(help.impact["GD"])}
                    icon={
                      <img
                        src={family}
                        style={{
                          maxHeight: "24px",
                          maxWidth: "24px",
                          minHeight: "24px",
                          minWidth: "24px"
                        }}
                      />
                    }
                    className="m-b-20"
                  >
                    weeks of aid for 1 family living{" "}
                    <strong>in extreme poverty</strong>
                  </Tile>
                ) : null}
              </div>
              <div className="col-6">
                <h1>
                  You have collected:{" "}
                  <span className="text-gradient">${help.moneyRaised}</span>
                </h1>
                <p>Some puchases take up to several weeks to be processed </p>
                <a
                  href="https://altruisto.com/purchase-processing"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="button-link uppercase-link m-b-20"
                >
                  FIND OUT WHY
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
