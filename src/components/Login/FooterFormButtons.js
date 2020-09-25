import React from 'react';
import Button from "components/CustomButtons/Button.js";
const FooterButtons = (props) => {
  const { submitLabel } = props;
  return (
    <div className="right">
      <Button className="form-control" color="rose" type="submit">{submitLabel || 'Submit'}</Button>
    </div>
  );
};

export default FooterButtons;
