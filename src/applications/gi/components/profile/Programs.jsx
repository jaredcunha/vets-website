import PropTypes from 'prop-types';
import React from 'react';

export class Programs extends React.Component {
  constructor(props) {
    super(props);
    this.renderProgramLabel = this.renderProgramLabel.bind(this);

    const { institution } = props;
    this.programs = {
      yr: {
        modal: 'yribbon',
        text: 'Yellow Ribbon',
        link: false,
      },

      studentVeteran: {
        modal: 'vetgroups',
        text: 'Student Veteran Group',
        link: {
          href: institution.studentVeteranLink,
          text: 'Site',
        },
      },

      poe: {
        modal: 'poe',
        text: 'Principles of Excellence',
        link: false,
      },

      eightKeys: {
        modal: 'eightKeys',
        text: '8 Keys to Veteran Success',
        link: false,
      },

      vetSuccessName: {
        modal: 'vsoc',
        text: 'VetSuccess on Campus',
        link: {
          href:
            institution.vetSuccessEmail &&
            `mailto:${institution.vetSuccessEmail}`,
          text: `Email ${institution.vetSuccessName}`,
        },
      },

      dodmou: {
        modal: 'ta',
        text: 'Military Tuition Assistance (TA)',
        link: false,
      },

      priorityEnrollment: {
        modal: 'priEnroll',
        text: 'Priority Enrollment',
        link: false,
      },
    };
  }

  renderProgramLabel(programKey, available) {
    const program = this.programs[programKey];
    const icon = available ? 'fa fa-check' : 'fa fa-remove';

    const link =
      (available &&
        program.link &&
        program.link.href && (
          <span>
            &nbsp;(
            <a
              href={program.link.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {program.link.text}
            </a>
            )
          </span>
        )) ||
      '';

    const label = program.modal ? (
      <button
        type="button"
        className="va-button-link learn-more-button"
        onClick={this.props.onShowModal.bind(this, program.modal)}
      >
        {program.text}
      </button>
    ) : (
      program.text
    );

    return (
      <div key={programKey}>
        <i className={icon} /> {label} {link}
      </div>
    );
  }

  render() {
    const it = this.props.institution;
    const programs = Object.keys(this.programs);
    const available = programs.filter(key => !!it[key] === true);

    return (
      <div className="programs row">
        {available.length > 0 ? (
          <div className="usa-width-one-half medium-6 large-6 column">
            {available.map(program =>
              this.renderProgramLabel.bind(this, program, true)(),
            )}
            <br />
          </div>
        ) : (
          <p>
            Please contact the school or their military office directly for
            information on the Veteran programs they offer.
          </p>
        )}
      </div>
    );
  }
}

Programs.propTypes = {
  institution: PropTypes.object,
  onShowModal: PropTypes.func,
};

export default Programs;
